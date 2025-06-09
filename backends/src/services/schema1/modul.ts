import prismaMysql from "../../lib/db2";
import prisma from "../../lib/db1";

interface IstDaftarModul {
  id: number;
  nama_modul: string | null;
  tahun_akademik: string | null;
  tim_modul: string | null;
  waktu_dibuat: Date;
  waktu_dirubah: Date | null;
  tanggal_mulai: Date | null;
  tanggal_selesai: Date | null;
  panjang_modul: string | null;
}

interface CountResult {
  count: number;
}

class ModulServices {
  static async getModul(
    page: number = 1,
    limit: number = 10,
    search: string = "",
    userId: number,
    role: string
  ) {
    try {
      if (role === "admin") {
        const existingAdmin = await prisma.admin.findUnique({
          where: { id: userId },
        });

        if (!existingAdmin) {
          throw new Error("Admin not found");
        }
      }

      const skip = (page - 1) * limit;

      // Sanitasi search
      const sanitizedSearch = search ? search.trim() : undefined;
      // console.log("sanitizedSearch:", sanitizedSearch); // Debugging

      const whereSchema1 = {
        nama_modul: sanitizedSearch ? { contains: sanitizedSearch } : {},
        // tahun_ajaran: sanitizedSearch ? {contains: sanitizedSearch} : {}
      };

      const modulsSchema1 = await prisma.modul.findMany({
        skip: Number(skip),
        take: Number(limit),
        where: whereSchema1,
        include: {
          bobot_nilai_akhirs: true,
          bobot_nilai_proses: true,
          modul_praktikums: { include: { praktikum: true } },
          sesi_penilaian: { orderBy: { updated_at: "desc" }, take: 1 },
        },
        orderBy: { created_at: "desc" },
      });
      // console.log("modulsSchema1:", modulsSchema1); // Debugging

      let modulsSchema2: IstDaftarModul[];
      if (sanitizedSearch) {
        modulsSchema2 = await prismaMysql.$queryRaw`
        SELECT * FROM ist_daftar_modul
        WHERE nama_modul LIKE ${`%${sanitizedSearch}%`}
        ORDER BY waktu_dibuat DESC
        LIMIT ${limit} OFFSET ${skip}
      `;
      } else {
        modulsSchema2 = await prismaMysql.$queryRaw`
        SELECT * FROM ist_daftar_modul
        ORDER BY waktu_dibuat DESC
        LIMIT ${limit} OFFSET ${skip}
      `;
      }
      // console.log("modulsSchema2:", modulsSchema2); // Debugging

      const modulIdsSchema1 = modulsSchema1.map((item) => item.id);
      const pesertaCounts = await prisma.pesertaModul.groupBy({
        by: ["modul_id"],
        _count: { id: true },
        where: { modul_id: { in: modulIdsSchema1 } },
      });
      const pesertaMap = new Map(
        pesertaCounts.map((item) => [item.modul_id, item._count.id])
      );

      const dataSchema1 = modulsSchema1.map((item, index) => {
        const latestSesi = item.sesi_penilaian[0];
        const tahunAjaranMulai = item.tahun_mulai;
        const tahunAjaranSelesai = item.tahun_selesai;
        const tahun_ajaran_str =
          tahunAjaranMulai && tahunAjaranSelesai
            ? `${tahunAjaranMulai}-${tahunAjaranSelesai}`
            : "N/A";
        return {
          no: skip + index + 1,
          id: item.id,
          nama_modul: item.nama_modul || "N/A",
          tahun_ajaran: tahun_ajaran_str,
          penanggung_jawab: item.penanggung_jawab || "N/A",
          total_siswa: pesertaMap.get(item.id) || 0,
          tanggal_buat:
            item.created_at?.toISOString().split("T")[0] ??
            item.created_at.toISOString().split("T")[0],
          tanggal_update:
            item.updated_at?.toISOString().split("T")[0] ??
            item.updated_at.toISOString().split("T")[0],
          sesi_diaktifkan:
            latestSesi?.sesi_mulai.toISOString().split("T")[0] || "N/A",
          sesi_dinonaktifkan:
            latestSesi?.sesi_selesai.toISOString().split("T")[0] || "N/A",
          praktikums:
            item.modul_praktikums.map((mp) => mp.praktikum.nama).join(", ") ||
            "N/A",
        };
      });

      const dataSchema2 = modulsSchema2.map((item: any, index: number) => ({
        no: skip + index + 1,
        id: item.id,
        nama_modul: item.nama_modul || "N/A",
        tahun_ajaran: item.tahun_akademik || "N/A",
        penanggung_jawab: item.tim_modul || "N/A",
        total_siswa: 0,
        tanggal_buat: item.waktu_dibuat?.toISOString().split("T")[0],
        tanggal_update: item.waktu_dirubah?.toString().split("T")[0],
        sesi_diaktifkan: item.tanggal_mulai || "N/A",
        sesi_dinonaktifkan: item.tanggal_selesai || "N/A",
        praktikums: "N/A",
      }));

      const data = [...dataSchema1, ...dataSchema2].sort((a, b) => {
        const dateA = a.tanggal_buat ? new Date(a.tanggal_buat).getTime() : 0;
        const dateB = b.tanggal_buat ? new Date(b.tanggal_buat).getTime() : 0;
        return dateB - dateA;
      });

      const totalSchema1 = await prisma.modul.count({ where: whereSchema1 });
      const totalSchema2: CountResult[] = await prismaMysql.$queryRaw`
      SELECT COUNT(*) as count FROM ist_daftar_modul
      WHERE nama_modul LIKE ${sanitizedSearch ? `%${sanitizedSearch}%` : "%%"}
    `;
      const totalSchema2Count = totalSchema2[0]?.count
        ? Number(totalSchema2[0].count)
        : 0;
      const total = totalSchema1 + totalSchema2Count;
      const totalPages = Math.ceil(total / limit);

      return {
        data,
        currentPage: Number(page),
        totalPages,
        totalItems: total,
        itemsPerPage: Number(limit),
      };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  static async createModul(
    nama_modul: string,
    tahun_mulai: number,
    tahun_selesai: number,
    penanggung_jawab: string,
    bobot_nilai_akhir: { sumatif: number; proses: number; praktikum: number },
    bobot_nilai_proses: {
      diskusi: number;
      buku_catatan: number;
      temu_pakar: number;
      peta_konsep: number;
      proses_praktik: number;
    },
    praktikum_id: number[],
    userId: number,
    role: string
  ) {
    try {
      // Validasi admin dari schema1
      if (role === "admin") {
        const existingAdmin = await prisma.admin.findUnique({
          where: { id: userId },
        });

        if (!existingAdmin) {
          throw new Error("Admin not found");
        }
      }

      // Validasi praktikum (pastikan semua ID praktikum valid)
      const existingPraktikums = await prisma.praktikum.findMany({
        where: { id: { in: praktikum_id } },
      });

      if (existingPraktikums.length !== praktikum_id.length) {
        throw new Error("One or more praktikum IDs are invalid");
      }

      // Validasi bobot nilai akhir (total 100%)
      const totalBobotAkhir =
        bobot_nilai_akhir.sumatif +
        bobot_nilai_akhir.proses +
        bobot_nilai_akhir.praktikum;
      if (totalBobotAkhir !== 100) {
        throw new Error("Total bobot nilai akhir harus 100%");
      }

      // Validasi bobot nilai proses (total 100%)
      const totalBobotProses =
        bobot_nilai_proses.diskusi +
        bobot_nilai_proses.buku_catatan +
        bobot_nilai_proses.temu_pakar +
        bobot_nilai_proses.peta_konsep +
        bobot_nilai_proses.proses_praktik;
      if (totalBobotProses !== 100) {
        throw new Error("Total bobot nilai proses harus 100%");
      }

      // Transaksi untuk membuat modul, sesi penilaian, dan praktikum
      const newModul = await prisma.$transaction(async (tx) => {
        const modul = await tx.modul.create({
          data: {
            nama_modul: nama_modul,
            tahun_mulai,
            tahun_selesai,
            penanggung_jawab,
          },
        });

        await tx.bobotNilaiAkhir.create({
          data: {
            modul_id: modul.id,
            nilai_sumatif: bobot_nilai_akhir.sumatif,
            nilai_proses: bobot_nilai_akhir.proses,
            nilai_praktik: bobot_nilai_akhir.praktikum,
          },
        });

        await tx.bobotNilaiProses.create({
          data: {
            modul_id: modul.id,
            diskusi: bobot_nilai_proses.diskusi,
            buku_catatan: bobot_nilai_proses.buku_catatan,
            temu_pakar: bobot_nilai_proses.temu_pakar,
            peta_konsep: bobot_nilai_proses.peta_konsep,
            proses_praktik: bobot_nilai_proses.proses_praktik,
          },
        });

        await tx.modulPraktikum.createMany({
          data: praktikum_id.map((praktikum_id) => ({
            modul_id: modul.id,
            praktikum_id,
          })),
        });

        return modul;
      });

      const relatedPraktikumIds = await prisma.modulPraktikum
        .findMany({
          where: { modul_id: newModul.id },
          select: { praktikum_id: true },
        })
        .then((result) => result.map((item) => item.praktikum_id));

      return {
        ...newModul,
        praktikum_id: relatedPraktikumIds,
      };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  static async addPemicu(
    userId: number,
    role: string,
    modul_id: number,
    pemicus: { nomor_pemicu: number; ilmuId: number; dokterId: number }[]
  ) {
    try {
      if (role === "admin") {
        const existingAdmin = await prisma.admin.findUnique({
          where: { id: userId },
        });

        if (!existingAdmin) {
          throw new Error("Admin not found");
        }
      }

      const existingModul = await prisma.modul.findUnique({
        where: {
          id: modul_id,
        },
      });

      if (!existingModul) {
        throw new Error("Modul not found");
      }

      const ilmuIds = pemicus.map((p) => p.ilmuId);
      const existingIlmu = await prisma.ilmu.findMany({
        where: {
          id: {
            in: ilmuIds,
          },
        },
      });

      const dokterIds = pemicus.map((p) => p.dokterId);
      const existingDokter = await prismaMysql.mda_master_dosen.findMany({
        where: {
          id: {
            in: dokterIds,
          },
        },
        select: {
          id: true,
          nama_dosen: true,
        },
      });

      const newPemicus = await prisma.$transaction(
        pemicus.map((pemicu) =>
          prisma.pemicu.create({
            data: {
              modul_id,
              nomor_pemicu: pemicu.nomor_pemicu,
              ilmu_id: pemicu.ilmuId,
              dosen_id: pemicu.dokterId,
            },
            include: {
              ilmu: true,
              modul: true,
            },
          })
        )
      );

      const formattedPemicus = newPemicus.map((p) => ({
        id: p.id,
        modul_id: p.modul_id,
        nama_modul: p.modul.nama_modul,
        nomor_pemicu: p.nomor_pemicu,
        ilmu: existingIlmu.find((i) => i.id === p.ilmu_id)?.nama_ilmu || "N/A",
        dokter:
          existingDokter.find((d) => d.id === p.dosen_id)?.nama_dosen || "N/A",
      }));

      return formattedPemicus;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  static async addPenilaianModul(
    userId: number,
    role: string,
    modul_id: number,
    total_soal_sum1: number,
    total_soal_sum2: number,
    total_soal_her_sum1: number,
    total_soal_her_sum2: number,
    penilaianProses: {
      praktikum_id: number;
      jenis_nilai_id: number;
      bobot: number;
    }[]
  ) {
    try {
      if (role === "admin") {
        const existingAdmin = await prisma.admin.findUnique({
          where: { id: userId },
        });

        if (!existingAdmin) {
          throw new Error("Admin not found");
        }
      }

      const existingModul = await prisma.modul.findUnique({
        where: { id: modul_id },
      });
      if (!existingModul) {
        throw new Error("Modul not found");
      }

      const praktikumIds = penilaianProses.map((p) => p.praktikum_id);
      const modulPraktikums = await prisma.modulPraktikum.findMany({
        where: { modul_id: modul_id, praktikum_id: { in: praktikumIds } },
        select: { praktikum_id: true, praktikum: true },
      });
      const validPraktikumIds = modulPraktikums.map((p) => p.praktikum_id);
      const invalidPraktikums = praktikumIds.filter(
        (id) => !validPraktikumIds.includes(id)
      );
      if (invalidPraktikums.length > 0) {
        throw new Error(
          `Praktikum dengan ID ${invalidPraktikums.join(
            ", "
          )} tidak terkait dengan modul ini`
        );
      }

      // Validasi jenis nilai ada di schema2
      const jenisNilaiIds = penilaianProses.map((p) => p.jenis_nilai_id);
      const jenisPenilaianList = await prismaMysql.mda_jenis_penilaian.findMany(
        {
          where: { id: { in: jenisNilaiIds } },
          select: { id: true, jenis_penilaian: true },
        }
      );
      const validJenisNilaiIds = jenisPenilaianList.map((j) => j.id);
      const invalidJenisNilai = jenisNilaiIds.filter(
        (id) => !validJenisNilaiIds.includes(id)
      );
      if (invalidJenisNilai.length > 0) {
        throw new Error(
          `Jenis nilai dengan ID ${invalidJenisNilai.join(
            ", "
          )} tidak ditemukan`
        );
      }

      // Validasi total bobot penilaian proses = 100%
      const totalBobot = penilaianProses.reduce((sum, p) => sum + p.bobot, 0);
      if (totalBobot !== 100) {
        throw new Error("Total bobot penilaian proses harus tepat 100%");
      }

      const newPenilaianModul = await prisma.penilaianModul.create({
        data: {
          modul_id: modul_id,
          total_soal_sum1: total_soal_sum1,
          total_soal_sum2: total_soal_sum2,
          total_her_sum1: total_soal_her_sum1,
          total_her_sum2: total_soal_her_sum2,
          penilaian_proses_praktikums: {
            create: penilaianProses.map((p) => ({
              praktikum_id: p.praktikum_id,
              jenis_nilai_id: p.jenis_nilai_id,
              bobot: p.bobot,
            })),
          },
        },
        include: {
          modul: true,
          penilaian_proses_praktikums: true,
        },
      });

      return newPenilaianModul;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  static async getModulById(userId: number, role: string, modul_id: number) {
    try {
      if (role === "admin") {
        const existingAdmin = await prisma.admin.findUnique({
          where: { id: userId },
        });

        if (!existingAdmin) {
          throw new Error("Admin not found");
        }
      }

      const modul = await prisma.modul.findFirst({
        where: {
          id: modul_id,
        },
        include: {
          pemicus: {
            include: {
              ilmu: true,
            },
          },
          bobot_nilai_akhirs: true,
          bobot_nilai_proses: true,
          modul_praktikums: {
            include: {
              praktikum: true,
            },
          },
          penilaian_moduls: {
            include: {
              penilaian_proses_praktikums: {
                include: {
                  praktikum: true,
                },
              },
            },
          },
          peserta_moduls: {
            select: {
              id: true,
              nim: true,
              created_at: true,
              updated_at: true,
            },
          },
          kelompoks: {
            include: {
              anggotas: {
                include: {
                  peserta_modul: true,
                },
              },
            },
          },
        },
      });

      if (!modul) {
        throw new Error("Modul not found");
      }

      const nims = modul.peserta_moduls.map((pm) => pm.nim);

      const [mahasiswaSchema1, mahasiswaSchema2] = await Promise.all([
        prisma.mahasiswa
          .findMany({
            where: {
              nim: { in: nims },
            },
            select: {
              id: true,
              nama_depan: true,
              nama_belakang: true,
              nim: true,
              angkatan: true,
            },
          })
          .catch((err) => {
            console.error("Prisma query error (mahasiswaSchema1):", err);
            return [];
          }),
        prismaMysql.mda_master_mahasiswa
          .findMany({
            where: {
              nim: { in: nims },
            },
            select: {
              id: true,
              nama_mahasiswa: true,
              nim: true,
              angkatan: true,
            },
          })
          .catch((err) => {
            console.error("MySQL query error (mahasiswaSchema2):", err);
            return [];
          }),
      ]);

      console.log("mahasiswa schema 1", mahasiswaSchema1);
      console.log("mahasiswa schema 2", mahasiswaSchema2);

      const nimSet = new Set();
      const duplicateNims = [];
      [...mahasiswaSchema1, ...mahasiswaSchema2].forEach((m) => {
        if (nimSet.has(m.nim)) {
          duplicateNims.push(m.nim);
        } else {
          nimSet.add(m.nim);
        }
      });

      const mahasiswaSchema2WithNimAngkatan = mahasiswaSchema2.map((user) => ({
        id: user.id,
        nama_siswa: user.nama_mahasiswa || "",
        nim: user.nim || "",
        angkatan: user.angkatan || null,
      }));

      const mahasiswaSchema1Formatted = mahasiswaSchema1.map((m) => ({
        id: m.id,
        nama_siswa: `${m.nama_depan} ${m.nama_belakang || ""} `.trim(),
        nim: m.nim || "",
        angkatan: m.angkatan || null,
      }));

      const allMahasiswaMap = new Map();
      mahasiswaSchema2WithNimAngkatan.forEach((m) => {
        allMahasiswaMap.set(m.nim, m);
      });
      mahasiswaSchema1Formatted.forEach((m) => {
        allMahasiswaMap.set(m.nim, m); // Schema1 menimpa schema2 jika ada duplikat
      });

      const allMahasiswa = Array.from(allMahasiswaMap.values());
      console.log("Combined mahasiswa:", allMahasiswa);

      const pesertaKelompokMap: { [key: number]: number | null } = {};
      modul.kelompoks.forEach((kelompok) => {
        const match = kelompok.nama_kelompok.match(/Kelompok (\d+)/);
        const nomorKelompok = match ? parseInt(match[1], 10) : null;
        kelompok.anggotas.forEach((anggota) => {
          if (anggota.peserta_modul_id) {
            pesertaKelompokMap[anggota.peserta_modul_id] = nomorKelompok;
          }
        });
      });

      const dosenIds = modul.pemicus
        .map((p) => p.dosen_id)
        .filter((id): id is number => id !== null && id !== undefined);

      const dosenList =
        dosenIds.length > 0
          ? await prismaMysql.mda_master_dosen.findMany({
              where: { id: { in: dosenIds } },
              select: { id: true, nama_dosen: true },
            })
          : [];

      const jenisNilaiIds = modul.penilaian_moduls
        .flatMap((pm) =>
          pm.penilaian_proses_praktikums.map((ppp) => ppp.jenis_nilai_id)
        )
        .filter((id): id is number => id !== null && id !== undefined);
      const jenisPenilaianList =
        jenisNilaiIds.length > 0
          ? await prismaMysql.mda_jenis_penilaian.findMany({
              where: { id: { in: jenisNilaiIds } },
              select: { id: true, jenis_penilaian: true },
            })
          : [];

      const formattedModul = {
        id: Number(modul.id),
        nama_modul: String(modul.nama_modul),
        penanggung_jawab: String(modul.penanggung_jawab),
        tahun_mulai: Number(modul.tahun_mulai),
        tahun_selesai: Number(modul.tahun_selesai),
        total_siswa: Number(modul.total_siswa),
        created_at: modul.created_at.toISOString(),
        updated_at: modul.updated_at.toISOString(),
        dosenId: modul.dosenId !== null ? Number(modul.dosenId) : null,
        tahunAjaranId:
          modul.tahunAjaranId !== null ? Number(modul.tahunAjaranId) : null,
        bobot_nilai_akhir: modul.bobot_nilai_akhirs.map((p) => ({
          id: Number(p.id),
          nilaiSumatif: Number(p.nilai_sumatif),
          nilaiProses: Number(p.nilai_proses),
          nilaiPraktik: Number(p.nilai_praktik),
        })),
        bobot_nilai_proses: modul.bobot_nilai_proses.map((p) => ({
          id: Number(p.id),
          diskusiKelompok: Number(p.diskusi),
          bukuCatatan: Number(p.buku_catatan),
          temuPakar: Number(p.temu_pakar),
          petaKonsep: Number(p.peta_konsep),
          prosesPraktikum: Number(p.proses_praktik),
        })),
        praktikums: modul.modul_praktikums.map((p) => ({
          id: Number(p.praktikum_id),
          praktikum: p.praktikum.nama,
        })),
        pemicus: modul.pemicus.map((p) => ({
          id: Number(p.id),
          nomorPemicu: Number(p.nomor_pemicu),
          ilmuNama: p.ilmu ? String(p.ilmu.nama_ilmu) : "N/A",
          dosenNama: p.dosen_id
            ? String(
                dosenList.find((d) => d.id === p.dosen_id)?.nama_dosen || "N/A"
              )
            : null,
          created_at: p.created_at.toISOString(),
          updated_at: p.updated_at.toISOString(),
        })),
        penilaian_moduls: modul.penilaian_moduls.map((pm) => ({
          id: Number(pm.id),
          modul_id: Number(pm.modul_id),
          total_soal_sum1: Number(pm.total_soal_sum1),
          total_soal_sum2: Number(pm.total_soal_sum2),
          total_her_sum1: Number(pm.total_her_sum1),
          total_her_sum2: Number(pm.total_her_sum2),
          created_at: pm.created_at.toISOString(),
          updated_at: pm.updated_at.toISOString(),
          penilaian_proses_praktikums: pm.penilaian_proses_praktikums.map(
            (ppp) => ({
              id: Number(ppp.id),
              praktikum: ppp.praktikum
                ? {
                    id: Number(ppp.praktikum.id),
                    nama: String(ppp.praktikum.nama),
                  }
                : null,
              jenis_nilai: ppp.jenis_nilai ? String(ppp.jenis_nilai) : null,
              jenis_nilai_id:
                ppp.jenis_nilai_id !== null ? Number(ppp.jenis_nilai_id) : null,
              jenis_nilai_nama: ppp.jenis_nilai_id
                ? String(
                    jenisPenilaianList.find((j) => j.id === ppp.jenis_nilai_id)
                      ?.jenis_penilaian || "N/A"
                  )
                : null,
              bobot: Number(ppp.bobot),
              created_at: ppp.created_at.toISOString(),
              updated_at: ppp.updated_at.toISOString(),
            })
          ),
        })),
        peserta_moduls: modul.peserta_moduls.map((pm) => {
          const mahasiswa = allMahasiswa.find((m) => m.nim === pm.nim);
          return {
            id: Number(pm.id),
            nama_siswa: mahasiswa
              ? mahasiswa.nama_siswa
              : "Nama tidak ditemukan",
            nim: pm.nim,
            angkatan: mahasiswa ? mahasiswa.angkatan : null,
            kelompok_nomor: pesertaKelompokMap[pm.id] || null,
            created_at: pm.created_at.toISOString(),
            updated_at: pm.updated_at.toISOString(),
          };
        }),
        kelompoks: modul.kelompoks.map((k) => ({
          id: Number(k.id),
          created_at: k.created_at.toISOString(),
          updated_at: k.updated_at.toISOString(),
        })),
      };

      return formattedModul;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  static async addPeserta(
    userId: number,
    role: string,
    modul_id: number,
    mahasiswaId: number[]
  ) {
    try {
      if (!mahasiswaId || !Array.isArray(mahasiswaId)) {
        throw new Error("mahasiswaId is undefined or not an array");
      }
      if (mahasiswaId.length === 0) {
        throw new Error("mahasiswaId is empty");
      }
      if (mahasiswaId.some((id) => typeof id !== "number" || isNaN(id))) {
        throw new Error("mahasiswaId contains invalid numbers");
      }

      if (role === "admin") {
        const existingAdmin = await prisma.admin.findUnique({
          where: { id: userId },
        });

        if (!existingAdmin) {
          throw new Error("Admin not found");
        }
      }

      const modul = await prisma.modul.findUnique({
        where: { id: modul_id },
      });

      if (!modul) {
        throw new Error("Modul not found");
      }

      console.log("Querying mahasiswa with ids:", mahasiswaId);
      const [mahasiswaSchema1, mahasiswaSchema2] = await Promise.all([
        prisma.mahasiswa
          .findMany({
            where: {
              id: { in: mahasiswaId },
            },
            select: {
              id: true,
              nim: true,
            },
          })
          .catch((err) => {
            console.error("Prisma query error (mahasiswaSchema1):", err);
            return [];
          }),
        prismaMysql.mda_master_mahasiswa
          .findMany({
            where: {
              id: { in: mahasiswaId },
            },
            select: {
              id: true,
              nim: true,
            },
          })
          .catch((err) => {
            console.error("MySQL query error (mahasiswaSchema2):", err);
            return [];
          }),
      ]);

      if (!Array.isArray(mahasiswaSchema1)) {
        throw new Error("mahasiswaSchema1 is not an array");
      }
      if (!Array.isArray(mahasiswaSchema2)) {
        throw new Error("mahasiswaSchema2 is not an array");
      }

      const idToNimMap = new Map([
        ...mahasiswaSchema1.map(
          (m) => [m.id, { nim: m.nim, mahasiswaId: m.id }] as const
        ),
        ...mahasiswaSchema2.map(
          (m) => [m.id, { nim: m.nim, mahasiswaId: m.id }] as const
        ),
      ]);

      const invalidIds = mahasiswaId.filter((id) => !idToNimMap.has(id));
      if (invalidIds.length > 0) {
        throw new Error(`Invalid mahasiswa_ids: ${invalidIds.join(", ")}`);
      }

      const validNims = mahasiswaId
        .map((id) => idToNimMap.get(id)!.nim)
        .filter((nim): nim is string => nim !== null);

      const existingPeserta = await prisma.pesertaModul.findMany({
        where: {
          modul_id,
          nim: { in: validNims },
        },
        select: {
          nim: true,
        },
      });

      const existingNims = existingPeserta.map((p) => p.nim);
      const newMahasiswaIds = mahasiswaId.filter((id) => {
        const nim = idToNimMap.get(id)!.nim;
        return nim !== null && !existingNims.includes(nim);
      });

      if (newMahasiswaIds.length === 0) {
        throw new Error(
          "Mahasiswa yang terpilih sudah terdaftar untuk modul ini"
        );
      }

      const mahasiswaIdsToValidate = newMahasiswaIds
        .map((id) => idToNimMap.get(id)!.mahasiswaId)
        .filter((id): id is number => id !== null);

      let validMahasiswaIds: number[] = [];
      if (mahasiswaIdsToValidate.length > 0) {
        const existingMahasiswa = await prisma.mahasiswa.findMany({
          where: {
            id: { in: mahasiswaIdsToValidate },
          },
          select: {
            id: true,
          },
        });
        validMahasiswaIds = existingMahasiswa.map((m) => m.id);
      }

      const pesertaRecords = newMahasiswaIds.map((mahasiswaId) => {
        const { nim, mahasiswaId: mId } = idToNimMap.get(mahasiswaId)!;
        if (nim === null) {
          throw new Error(`Nim is null for mahasiswaId: ${mahasiswaId}`);
        }
        const finalMahasiswaId =
          mId && validMahasiswaIds.includes(mId) ? mId : null;
        return {
          modul_id,
          nim: nim,
          mahasiswaId: finalMahasiswaId,
          created_at: new Date(),
          updated_at: new Date(),
        };
      });

      await prisma.pesertaModul.createMany({
        data: pesertaRecords,
      });

      return {
        success: true,
        message: `Tambah peserta di modul id ${modul_id} berhasil`,
      };
    } catch (error) {
      console.error("Error in addPeserta:", error);
      throw new Error((error as Error).message);
    }
  }

  static async createKelompok(userId: number, role: string, modul_id: number) {
    try {
      if (role === "admin") {
        const existingAdmin = await prisma.admin.findUnique({
          where: { id: userId },
        });

        if (!existingAdmin) {
          throw new Error("Admin not found");
        }
      }

      const modul = await prisma.modul.findUnique({
        where: { id: modul_id },
      });

      if (!modul) {
        throw new Error("Modul not found");
      }

      const kelompokCount = await prisma.kelompok.count({
        where: {
          modul_id,
        },
      });

      const newKelompokName = `Kelompok ${kelompokCount + 1}`;
      const kelompok = await prisma.kelompok.create({
        data: {
          modul_id,
          nama_kelompok: newKelompokName,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      return kelompok;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  static async deleteKelompok(
    userId: number,
    role: string,
    modul_id: number,
    kelompokId: number
  ) {
    try {
      if (role === "admin") {
        const existingAdmin = await prisma.admin.findUnique({
          where: { id: userId },
        });

        if (!existingAdmin) {
          throw new Error("Admin not found");
        }
      }

      const modul = await prisma.modul.findUnique({
        where: { id: modul_id },
      });
      if (!modul) {
        throw new Error("Modul tidak ditemukan");
      }

      const kelompok = await prisma.kelompok.findFirst({
        where: {
          id: kelompokId,
          modul_id,
        },
      });
      if (!kelompok) {
        throw new Error("Kelompok tidak ditemukan");
      }

      await prisma.kelompok.delete({
        where: { id: kelompok.id },
      });
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  static async addPesertaToKelompok(
    userId: number,
    role: string,
    modul_id: number,
    kelompokId: number,
    nims: string[]
  ) {
    try {
      if (role === "admin") {
        const existingAdmin = await prisma.admin.findUnique({
          where: { id: userId },
        });

        if (!existingAdmin) {
          throw new Error("Admin not found");
        }
      }

      const modul = await prisma.modul.findUnique({
        where: { id: modul_id },
      });

      if (!modul) {
        throw new Error("Modul not found");
      }

      const kelompok = await prisma.kelompok.findUnique({
        where: {
          id: kelompokId,
        },
      });

      if (!kelompok || kelompok.modul_id !== modul_id) {
        throw new Error(
          "Kelompok tidak ditemukan atau tidak terkait dengan modul ini"
        );
      }

      const existingPesertaModul = await prisma.pesertaModul.findMany({
        where: {
          nim: { in: nims },
          modul_id,
        },
        select: {
          id: true,
          nim: true,
        },
      });

      console.log("Received nims:", nims);
      console.log("Found pesertaModul:", existingPesertaModul);

      if (existingPesertaModul.length !== nims.length) {
        const validNims = existingPesertaModul.map((p) => p.nim);
        const invalidNims = nims.filter((nim) => !validNims.includes(nim));
        throw new Error(
          `Nims tidak valid atau tidak terkait: ${invalidNims.join(", ")}`
        );
      }

      const nimCount = await prisma.pesertaModul.groupBy({
        by: ["nim"],
        where: { modul_id, nim: { in: nims } },
        _count: { nim: true },
      });
      const duplicateNims = nimCount
        .filter((nc) => nc._count.nim > 1)
        .map((nc) => nc.nim);
      if (duplicateNims.length > 0) {
        throw new Error(`Duplikat NIM ditemukan: ${duplicateNims.join(", ")}`);
      }

      const pesertaModulIds = existingPesertaModul.map((pm) => pm.id);
      console.log("Generated pesertaModulIds:", pesertaModulIds);

      const existingAnggota = await prisma.kelompokAnggota.findMany({
        where: {
          peserta_modul_id: { in: pesertaModulIds },
        },
        select: {
          id: true,
          peserta_modul_id: true,
          kelompok_id: true,
        },
      });

      const pesertaToUpdateIds = existingAnggota
        .filter((a) => a.kelompok_id !== kelompokId)
        .map((a) => a.peserta_modul_id);
      const pesertaToAddIds = pesertaModulIds.filter(
        (id) => !existingAnggota.some((a) => a.peserta_modul_id === id)
      );

      if (pesertaToUpdateIds.length === 0 && pesertaToAddIds.length === 0) {
        throw new Error(
          "Tidak ada peserta yang perlu dipindahkan atau ditambahkan"
        );
      }

      await prisma.$transaction(async (tx) => {
        if (pesertaToUpdateIds.length > 0) {
          await tx.kelompokAnggota.updateMany({
            where: {
              peserta_modul_id: { in: pesertaToUpdateIds },
            },
            data: {
              kelompok_id: kelompokId,
              updated_at: new Date(),
            },
          });
        }

        if (pesertaToAddIds.length > 0) {
          await tx.kelompokAnggota.createMany({
            data: pesertaToAddIds.map((pesertaModulId) => ({
              kelompok_id: kelompokId,
              peserta_modul_id: pesertaModulId,
              created_at: new Date(),
              updated_at: new Date(),
            })),
          });
        }
      });

      const updatedAnggota = await prisma.kelompokAnggota.findMany({
        where: { kelompok_id: kelompokId },
        include: {
          peserta_modul: { select: { nim: true } },
        },
      });
      console.log("Updated anggota in kelompok:", updatedAnggota);
      return updatedAnggota;
    } catch (error) {
      console.error("Error in addPesertaToKelompok:", error);
      throw new Error((error as Error).message);
    }
  }

  static async deletePesertaFromKelompok(
    userId: number,
    role: string,
    kelompokAnggotaId: number
  ) {
    try {
      if (role === "admin") {
        const existingAdmin = await prisma.admin.findUnique({
          where: { id: userId },
        });

        if (!existingAdmin) {
          throw new Error("Admin not found");
        }
      }

      const kelompokAnggota = await prisma.kelompokAnggota.findUnique({
        where: { id: kelompokAnggotaId },
        include: {
          kelompok: true,
          peserta_modul: { select: { nim: true } },
        },
      });

      if (!kelompokAnggota) {
        throw new Error("Anggota kelompok tidak ditemukan");
      }

      if (!kelompokAnggota.kelompok) {
        throw new Error("Kelompok terkait tidak ditemukan");
      }

      await prisma.kelompokAnggota.delete({
        where: { id: kelompokAnggotaId },
      });
      
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export default ModulServices;
