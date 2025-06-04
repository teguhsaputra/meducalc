import prisma from "../../lib/db1";
import prismaMysql from "../../lib/db2";
import { PenilaianInput } from "../../types/types";

interface CountResult {
  count: number;
}

class PenilaianModulServices {
  static async getModulForInputPenilaian(
    userId: number,
    role: string,
    page: number = 1,
    limit: number = 10,
    searchModul: string = "",
    searchSchoolYear: string = ""
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

      const whereSchema1 = {
        AND: [
          searchModul ? { nama_modul: { contains: searchModul } } : {},
          searchSchoolYear
            ? {
                OR: [
                  {
                    tahun_mulai: {
                      equals:
                        parseInt(searchSchoolYear.split("/")[0]) || undefined,
                    },
                  },
                  {
                    tahun_selesai: {
                      equals:
                        parseInt(searchSchoolYear.split("/")[1]) || undefined,
                    },
                  },
                ].filter((clause) => Object.keys(clause).length > 0),
              }
            : {},
        ].filter((clause) => Object.keys(clause).length > 0),
      };

      const totalModulSchema1 = await prisma.modul.count({
        where: whereSchema1,
      });

      const modulListSchema1 = await prisma.modul.findMany({
        where: whereSchema1,
        include: {
          peserta_moduls: true,
        },
        orderBy: {
          created_at: "desc",
        },
      });

      const dataSchema1 = modulListSchema1.map((modul) => ({
        id: modul.id,
        nama_modul: modul.nama_modul,
        tahun_ajaran:
          modul.tahun_mulai && modul.tahun_selesai
            ? `${modul.tahun_mulai}/${modul.tahun_selesai}`
            : "N/A",
        total_siswa: modul.peserta_moduls.length,
        created_at: modul.created_at,
      }));

      let modulsSchema2: any[] = [];
      let totalModulSchema2 = 0;

      let totalQueryString = `SELECT COUNT(*) as count FROM ist_daftar_modul`;
      let dataQueryString = `SELECT * FROM ist_daftar_modul`;
      const conditions: string[] = [];

      if (searchModul) {
        conditions.push(`nama_modul LIKE '%${searchModul}%'`);
      }

      if (searchSchoolYear) {
        conditions.push(`tahun_akademik LIKE '%${searchSchoolYear}%'`);
      }

      if (conditions.length > 0) {
        const whereClause = `WHERE ${conditions.join(" AND ")}`;
        totalQueryString += ` ${whereClause}`;
        dataQueryString += ` ${whereClause}`;
      }

      dataQueryString += ` ORDER BY waktu_dibuat DESC`;

      // Eksekusi query total menggunakan $queryRawUnsafe
      const totalQuery = await prismaMysql.$queryRawUnsafe<CountResult[]>(
        totalQueryString
      );
      totalModulSchema2 = Number(totalQuery[0].count) || 0; // Konversi count ke number

      // Eksekusi query data jika ada hasil
      if (totalModulSchema2 > 0) {
        modulsSchema2 = await prismaMysql.$queryRawUnsafe(dataQueryString);
      }
      const dataSchema2 = modulsSchema2.map((modul: any) => ({
        id: modul.id,
        nama_modul: modul.nama_modul || "N/A",
        tahun_ajaran: modul.tahun_akademik || "N/A",
        total_siswa: 0,
        created_at: new Date(modul.waktu_dibuat),
      }));

      const combinedData = [...dataSchema1, ...dataSchema2];
      combinedData.sort(
        (a, b) => b.created_at.getTime() - a.created_at.getTime()
      );

      const data = combinedData.slice(skip, skip + limit);
      const totalModul = totalModulSchema1 + totalModulSchema2;
      const totalPages = Math.ceil(totalModul / limit);
      return {
        data,
        totalItems: totalModul,
        totalPages,
        currentPage: page,
        pageSize: limit,
      };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  static async getModulDetailForInputPenilaian(
    userId: number,
    role: string,
    namaModul: string,
    page: number = 1,
    limit: number = 10,
    searchSiswa: string = "",
    searchNim: string = "",
    searchAngkatan: string = ""
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

      const angkatanValue = searchAngkatan
        ? parseInt(searchAngkatan)
        : undefined;

      const angkatanValueSchema2 = searchAngkatan || undefined;

      const modul = await prisma.modul.findFirst({
        where: {
          nama_modul: namaModul,
        },
        include: {
          peserta_moduls: {
            select: {
              id: true,
              nim: true,
            },
          },
        },
      });

      if (!modul) {
        throw new Error("Modul not found");
      }

      const pesertaModulIds = modul.peserta_moduls.map((pm) => pm.id);
      const nims = modul.peserta_moduls.map((pm) => pm.nim);

      const mahasiswaSchema1 = await prisma.mahasiswa.findMany({
        where: {
          nim: { in: nims },
          AND: [
            searchSiswa
              ? {
                  OR: [
                    { nama_depan: { contains: searchSiswa } },
                    { nama_belakang: { contains: searchSiswa } },
                  ],
                }
              : undefined,
            searchNim ? { nim: { contains: searchNim } } : undefined,
            angkatanValue !== undefined
              ? { angkatan: angkatanValue }
              : undefined,
          ].filter((clause) => clause !== undefined),
        },
        select: {
          id: true,
          nama_depan: true,
          nama_belakang: true,
          nim: true,
          angkatan: true,
          username: true,
          created_at: true,
        },
      });

      const dataSchema1 = mahasiswaSchema1.map((m) => ({
        id: m.id,
        nama: `${m.nama_depan || ""} ${m.nama_belakang || ""}`.trim() || "N/A",
        nim: m.nim || "N/A",
        angkatan: m.angkatan?.toString() || "N/A",
        username: m.username || "N/A",
        created_at: m.created_at,
      }));

      const totalSiswaSchema1 = dataSchema1.length;

      const mahasiswaSchema2 = await prismaMysql.mda_master_mahasiswa.findMany({
        where: {
          nim: { in: nims },
          AND: [
            searchSiswa
              ? { nama_mahasiswa: { contains: searchSiswa } }
              : undefined,
            searchNim ? { nim: { contains: searchNim } } : undefined,
            angkatanValueSchema2 !== undefined
              ? { angkatan: angkatanValueSchema2 }
              : undefined,
          ].filter((clause) => clause !== undefined),
        },
        select: {
          id: true,
          nama_mahasiswa: true,
          nim: true,
          angkatan: true,
          waktu_dibuat: true,
        },
      });

      const mahasiswaSetUser = await prismaMysql.set_user.findMany({
        where: {
          tingkat_user: "mahasiswa",
          id_mahasiswa: { in: pesertaModulIds },
        },
        select: {
          id_mahasiswa: true,
          username: true,
          nama: true,
        },
      });

      const dataSchema2 = mahasiswaSchema2.map((m) => {
        const userData = mahasiswaSetUser.find((u) => u.id_mahasiswa === m.id);
        const rawUsername = userData?.username || "";
        const nim = m.nim || "";
        const derivedUsername =
          rawUsername && rawUsername !== nim
            ? rawUsername
            : (m.nama_mahasiswa || userData?.nama || "")
                .toLowerCase()
                .replace(/\s+/g, "_") || `user_${m.id}`;

        return {
          id: m.id,
          nama: m.nama_mahasiswa || userData?.nama || "N/A",
          nim: m.nim || "N/A",
          angkatan: m.angkatan?.toString() || "N/A",
          username: derivedUsername,
          created_at: m.waktu_dibuat,
        };
      });

      const filteredDataSchema2 = dataSchema2.filter(
        (m) =>
          (!searchSiswa ||
            m.nama?.toLowerCase().includes(searchSiswa.toLowerCase())) &&
          (!searchNim ||
            m.nim?.toLowerCase().includes(searchNim.toLowerCase())) &&
          (!searchAngkatan || m.angkatan?.includes(searchAngkatan))
      );

      const totalSiswaSchema2 = filteredDataSchema2.length;
      const combinedData = [...dataSchema1, ...filteredDataSchema2];

      combinedData.sort((a, b) => {
        const dateA = new Date(a.created_at || "1970-01-01");
        const dateB = new Date(b.created_at || "1970-01-01");
        return dateB.getTime() - dateA.getTime();
      });

      const data = combinedData.slice(skip, skip + limit).map((m) => ({
        nama_siswa: m.nama,
        nim: m.nim,
        angkatan: m.angkatan,
        username: m.username,
      }));

      const totalSiswa = totalSiswaSchema1 + totalSiswaSchema2;
      const totalPages = Math.ceil(totalSiswa / limit);

      return {
        data,
        totalItems: totalSiswa,
        totalPages,
        currentPage: page,
        pageSize: limit,
      };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  static async getModulByNim(
    userId: number,
    role: string,
    namaModul: string,
    nim: string
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

      const trimmedNamaModul = namaModul.trim();

      const pesertaSchema2 = await prismaMysql.mda_master_mahasiswa.findFirst({
        where: {
          nim,
        },
      });

      let pesertaSchema1;
      if (!pesertaSchema2) {
        pesertaSchema1 = await prisma.mahasiswa.findFirst({
          where: {
            nim,
          },
        });
      }

      const peserta = pesertaSchema2 || pesertaSchema1;
      if (!peserta) {
        throw new Error("Peserta not found");
      }

      const modulExists = await prisma.modul.findFirst({
        where: { nama_modul: trimmedNamaModul },
      });
      console.log("Modul exists with nama_modul:", modulExists);

      const pesertaModul = await prisma.pesertaModul.findFirst({
        where: {
          nim,
          modul: {
            nama_modul: trimmedNamaModul, // Filter langsung berdasarkan nama_modul
          },
        },
        include: {
          kelompok_anggotas: {
            include: {
              kelompok: true,
            },
          },
          modul: {
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
            },
          },
        },
      });

      if (!pesertaModul) {
        throw new Error("Peserta not registered in the specified modul");
      }

      const modul = pesertaModul.modul;

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

      // Ambil data jenis penilaian
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

      // Tentukan kelompok nomor
      let kelompokNomor: number | null = null;
      if (pesertaModul.kelompok_anggotas.length > 0) {
        const kelompok = pesertaModul.kelompok_anggotas[0].kelompok;
        const match = kelompok?.nama_kelompok.match(/Kelompok (\d+)/);
        kelompokNomor = match ? parseInt(match[1], 10) : null;
      }

      // Format response
      const formattedModul = {
        id: Number(modul.id),
        nama_modul: String(modul.nama_modul),
        bobot_nilai_akhir: {
          nilaiSumatif: Number(modul.bobot_nilai_akhirs[0]?.nilai_sumatif) || 0,
          nilaiProses: Number(modul.bobot_nilai_akhirs[0]?.nilai_proses) || 0,
          nilaiPraktik: Number(modul.bobot_nilai_akhirs[0]?.nilai_praktik) || 0,
        },
        bobot_nilai_proses: {
          diskusiKelompok: Number(modul.bobot_nilai_proses[0]?.diskusi) || 0,
          bukuCatatan: Number(modul.bobot_nilai_proses[0]?.buku_catatan) || 0,
          temuPakar: Number(modul.bobot_nilai_proses[0]?.temu_pakar) || 0,
          petaKonsep: Number(modul.bobot_nilai_proses[0]?.peta_konsep) || 0,
          prosesPraktikum:
            Number(modul.bobot_nilai_proses[0]?.proses_praktik) || 0,
        },
        praktikums: modul.modul_praktikums.map((p) => ({
          id: Number(p.praktikum_id),
          praktikum: p.praktikum.nama,
        })),
        pemicus: modul.pemicus.map((p) => ({
          nomorPemicu: Number(p.nomor_pemicu),
          ilmuNama: p.ilmu ? String(p.ilmu.nama_ilmu) : "N/A",
          dosenNama: p.dosen_id
            ? String(
                dosenList.find((d) => d.id === p.dosen_id)?.nama_dosen || "N/A"
              )
            : null,
        })),
        penilaian_moduls: {
          total_soal_sum1:
            Number(modul.penilaian_moduls[0]?.total_soal_sum1) || 0,
          total_soal_sum2:
            Number(modul.penilaian_moduls[0]?.total_soal_sum2) || 0,
          total_her_sum1:
            Number(modul.penilaian_moduls[0]?.total_her_sum1) || 0,
          total_her_sum2:
            Number(modul.penilaian_moduls[0]?.total_her_sum2) || 0,
          penilaian_proses_praktikums:
            modul.penilaian_moduls[0]?.penilaian_proses_praktikums.map(
              (ppp) => ({
                praktikum: ppp.praktikum ? String(ppp.praktikum.nama) : "N/A",
                jenis_nilai: ppp.jenis_nilai_id
                  ? String(
                      jenisPenilaianList.find(
                        (j) => j.id === ppp.jenis_nilai_id
                      )?.jenis_penilaian || "N/A"
                    )
                  : "N/A",
                bobot: Number(ppp.bobot),
              })
            ) || [],
        },
        peserta: {
          id: Number(peserta.id),
          nama_siswa: pesertaSchema2
            ? String(pesertaSchema2.nama_mahasiswa)
            : `${pesertaSchema1?.nama_depan} ${
                pesertaSchema1?.nama_belakang || ""
              }`.trim(),
          nim: String(peserta.nim),
          angkatan: pesertaSchema2
            ? String(pesertaSchema2.angkatan)
            : pesertaSchema1?.angkatan || null,
          kelompok_nomor: kelompokNomor,
        },
      };

      return formattedModul;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  static async InputPenilaian(
    userId: number,
    role: string,
    nim: string,
    namaModul: string,
    input: PenilaianInput
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

      const trimmedNamaModul = namaModul.trim();

      const pesertaSchema2 = await prismaMysql.mda_master_mahasiswa.findFirst({
        where: { nim },
      });

      let pesertaSchema1;
      if (!pesertaSchema2) {
        pesertaSchema1 = await prisma.mahasiswa.findFirst({
          where: { nim },
        });
      }

      const peserta = pesertaSchema2 || pesertaSchema1;
      if (!peserta) {
        throw new Error("Peserta not found");
      }

      const pesertaModul = await prisma.pesertaModul.findFirst({
        where: {
          nim,
          modul: {
            nama_modul: trimmedNamaModul,
          },
        },
      });

      if (!pesertaModul) {
        throw new Error("Peserta not registered in any modul");
      }

      const modulId = pesertaModul.modul_id;

      const modul = await prisma.modul.findFirst({
        where: {
          id: modulId,
        },
        include: {
          bobot_nilai_akhirs: true,
          bobot_nilai_proses: true,
          penilaian_moduls: true,
          modul_praktikums: {
            include: {
              praktikum: true,
            },
          },
          pemicus: true,
        },
      });

      if (!modul) {
        throw new Error("Modul not found for this peserta");
      }

      const bobotNilaiAkhir = {
        nilaiSumatif: Number(modul.bobot_nilai_akhirs[0]?.nilai_sumatif) || 0,
        nilaiProses: Number(modul.bobot_nilai_akhirs[0]?.nilai_proses) || 0,
        nilaiPraktik: Number(modul.bobot_nilai_akhirs[0]?.nilai_praktik) || 0,
      };

      const bobotNilaiProses = {
        diskusiKelompok: Number(modul.bobot_nilai_proses[0]?.diskusi) || 0,
        bukuCatatan: Number(modul.bobot_nilai_proses[0]?.buku_catatan) || 0,
        temuPakar: Number(modul.bobot_nilai_proses[0]?.temu_pakar) || 0,
        petaKonsep: Number(modul.bobot_nilai_proses[0]?.peta_konsep) || 0,
        prosesPraktikum:
          Number(modul.bobot_nilai_proses[0]?.proses_praktik) || 0,
      };

      const totalBobotProses =
        bobotNilaiProses.diskusiKelompok +
        bobotNilaiProses.bukuCatatan +
        bobotNilaiProses.temuPakar +
        bobotNilaiProses.petaKonsep +
        bobotNilaiProses.prosesPraktikum;
      if (totalBobotProses !== 100) {
        throw new Error("Total bobot nilai proses harus 100");
      }

      const totalSoalSum1 =
        Number(modul.penilaian_moduls[0]?.total_soal_sum1) || 0;
      const totalSoalSum2 =
        Number(modul.penilaian_moduls[0]?.total_soal_sum2) || 0;
      const totalHerSum1 =
        Number(modul.penilaian_moduls[0]?.total_her_sum1) || 0;
      const totalHerSum2 =
        Number(modul.penilaian_moduls[0]?.total_her_sum2) || 0;

      if (totalSoalSum1 === 0 || totalSoalSum2 === 0) {
        throw new Error("Total soal sumatif tidak valid");
      }

      const skorSumatif1 = (input.totalBenarSumatif1 / totalSoalSum1) * 100;
      const skorSumatif2 = (input.totalBenarSumatif2 / totalSoalSum2) * 100;
      let finalSumatif = Number(((skorSumatif1 + skorSumatif2) / 2).toFixed(2));

      if (totalHerSum1 > 0 && totalHerSum2 > 0) {
        const skorHerSumatif1 =
          (input.totalBenarHerSumatif1 / totalHerSum1) * 100;
        const skorHerSumatif2 =
          (input.totalBenarHerSumatif2 / totalHerSum2) * 100;
        const skorHerSumatif = Number(
          ((skorHerSumatif1 + skorHerSumatif2) / 2).toFixed(2)
        );
        finalSumatif = Number(
          Math.max(finalSumatif, skorHerSumatif).toFixed(2)
        );
      }

      const praktikumIds = modul.modul_praktikums.map((p) =>
        String(p.praktikum_id)
      );
      const nilaiPraktikumValues = praktikumIds.map((id) => ({
        id,
        nilai: Number(input.nilaiPraktikum[id]) || 0,
        nilaiHer: Number(input.nilaiHerPraktikum[id]) || 0,
      }));

      const nilaiAkhirPraktikum = nilaiPraktikumValues.map((v) =>
        Number(Math.max(v.nilai, v.nilaiHer).toFixed(2))
      );
      const jumlahPraktikum = nilaiAkhirPraktikum.length;

      if (jumlahPraktikum === 0) {
        throw new Error("Tidak ada praktikum yang terkait dengan modul ini");
      }

      const nilaiPraktikumRata = Number(
        (
          nilaiAkhirPraktikum.reduce((sum, val) => sum + val, 0) /
          jumlahPraktikum
        ).toFixed(2)
      );

      const diskusiKelompokValues = Object.values(
        input.diskusiKelompokNilai
      ).map((val) => Number(val) || 0);
      const diskusiKelompokAvg =
        Number(
          (
            diskusiKelompokValues.reduce((sum, val) => sum + val, 0) /
            diskusiKelompokValues.length
          ).toFixed(2)
        ) || 0;

      const catatanValues = Object.values(input.catatanNilai).map(
        (val) => Number(val) || 0
      );
      const catatanAvg =
        Number(
          (
            catatanValues.reduce((sum, val) => sum + val, 0) /
            catatanValues.length
          ).toFixed(2)
        ) || 0;

      const temuPakarValues = Object.values(input.temuPakarNilai).map(
        (val) => Number(val) || 0
      );
      const temuPakarAvg =
        Number(
          (
            temuPakarValues.reduce((sum, val) => sum + val, 0) /
            temuPakarValues.length
          ).toFixed(2)
        ) || 0;

      const petaKoncepValues = Object.values(input.petaKonsepNilai).flatMap(
        (pemicu) => Object.values(pemicu).map((item) => Number(item.nilai) || 0)
      );
      const petaKoncepAvg =
        Number(
          (
            petaKoncepValues.reduce((sum, val) => sum + val, 0) /
            petaKoncepValues.length
          ).toFixed(2)
        ) || 0;

      const prosesPraktikumValues = Object.values(
        input.prosesPraktikumNilai
      ).map((item) => Number(item.nilai) || 0);
      const prosesPraktikumAvg =
        Number(
          (
            prosesPraktikumValues.reduce((sum, val) => sum + val, 0) /
            prosesPraktikumValues.length
          ).toFixed(2)
        ) || 0;

      const nilaiProses = Number(
        (
          (diskusiKelompokAvg * bobotNilaiProses.diskusiKelompok) / 100 +
          (catatanAvg * bobotNilaiProses.bukuCatatan) / 100 +
          (temuPakarAvg * bobotNilaiProses.temuPakar) / 100 +
          (petaKoncepAvg * bobotNilaiProses.petaKonsep) / 100 +
          (prosesPraktikumAvg * bobotNilaiProses.prosesPraktikum) / 100
        ).toFixed(2)
      );

      const totalBobotAkhir =
        bobotNilaiAkhir.nilaiSumatif +
        bobotNilaiAkhir.nilaiProses +
        bobotNilaiAkhir.nilaiPraktik;
      if (totalBobotAkhir !== 100) {
        throw new Error("Total bobot nilai akhir harus 100");
      }

      const nilaiAkhir = Number(
        (
          (finalSumatif * bobotNilaiAkhir.nilaiSumatif) / 100 +
          (nilaiProses * bobotNilaiAkhir.nilaiProses) / 100 +
          (nilaiPraktikumRata * bobotNilaiAkhir.nilaiPraktik) / 100
        ).toFixed(2)
      );

      await prisma.penilaianSumatif.create({
        data: {
          peserta_modul_id: pesertaModul.id,
          total_benar_sum1: input.totalBenarSumatif1,
          total_benar_sum2: input.totalBenarSumatif2,
          total_benar_her_sum1:
            totalHerSum1 > 0 ? input.totalBenarHerSumatif1 : null,
          total_benar_her_sum2:
            totalHerSum2 > 0 ? input.totalBenarHerSumatif2 : null,
          nilai_akhir: Number(finalSumatif.toFixed(2)),
        },
      });

      const praktikumData = nilaiPraktikumValues.map((v) => ({
        peserta_modul_id: pesertaModul.id,
        praktikum_id: Number(v.id),
        nilai: Number(v.nilai.toFixed(2)),
        nilai_her: Number(v.nilaiHer.toFixed(2)),
        nilai_akhir: Number(Math.max(v.nilai, v.nilaiHer).toFixed(2)),
      }));

      await prisma.penilaianPraktikum.createMany({
        data: praktikumData,
        skipDuplicates: true,
      });

      await prisma.penilaianProses.create({
        data: {
          peserta_modul_id: pesertaModul.id,
          diskusi_kelompok: Number(diskusiKelompokAvg.toFixed(2)),
          buku_catatan: Number(catatanAvg.toFixed(2)),
          temu_pakar: Number(temuPakarAvg.toFixed(2)),
          peta_konsep: Number(petaKoncepAvg.toFixed(2)),
          proses_praktikum: Number(prosesPraktikumAvg.toFixed(2)),
          nilai_akhir: Number(nilaiProses.toFixed(2)),
        },
      });

      await prisma.penilaianAkhir.create({
        data: {
          peserta_modul_id: pesertaModul.id,
          nilai_sumatif: Number(finalSumatif.toFixed(2)),
          nilai_proses: Number(nilaiProses.toFixed(2)),
          nilai_praktikum: Number(nilaiPraktikumRata.toFixed(2)),
          nilai_akhir: Number(nilaiAkhir.toFixed(2)),
        },
      });

      const diskusiKelompokData = Object.entries(
        input.diskusiKelompokNilai
      ).map(([key, value]) => {
        const [kelompok, pemicu] = key.split("-");
        return {
          peserta_modul_id: pesertaModul.id,
          kelompok_id: kelompok,
          pemicu_id: Number(pemicu.replace("P", "")),
          nilai: Number(parseFloat(value).toFixed(2)),
        };
      });

      await prisma.penilaianDiskusiKelompok.createMany({
        data: diskusiKelompokData,
        skipDuplicates: true,
      });

      const bukuCatatanData = Object.entries(input.catatanNilai).map(
        ([label, value]) => ({
          peserta_modul_id: pesertaModul.id,
          label,
          nilai: Number(parseFloat(value).toFixed(2)),
        })
      );

      await prisma.penilaianBukuCatatan.createMany({
        data: bukuCatatanData,
        skipDuplicates: true,
      });

      const temuPakarData = Object.entries(input.temuPakarNilai).map(
        ([label, value]) => ({
          peserta_modul_id: pesertaModul.id,
          label,
          nilai: Number(parseFloat(value).toFixed(2)),
        })
      );

      await prisma.penilaianTemuPakar.createMany({
        data: temuPakarData,
        skipDuplicates: true,
      });

      const petaKoncepData = Object.entries(input.petaKonsepNilai).flatMap(
        ([pemicu, ilmus]) =>
          Object.entries(ilmus).map(([ilmu, detail]) => ({
            peserta_modul_id: pesertaModul.id,
            pemicu_id: Number(pemicu),
            ilmu,
            dokter: detail.dokter || "",
            nilai: Number(parseFloat(detail.nilai).toFixed(2)),
          }))
      );

      await prisma.penilaianPetaKonsep.createMany({
        data: petaKoncepData,
        skipDuplicates: true,
      });

      const praktikumMap = new Map<string, number>();
      modul.modul_praktikums.forEach((mp) => {
        praktikumMap.set(mp.praktikum.nama.toLowerCase(), mp.praktikum_id);
      });

      const prosesPraktikumData = Object.entries(
        input.prosesPraktikumNilai
      ).flatMap(([praktikumName, jenisObj]) => {
        const praktikumId = praktikumMap.get(praktikumName.toLowerCase());
        if (!praktikumId) {
          throw new Error(
            `Praktikum dengan nama ${praktikumName} tidak ditemukan untuk modul ini`
          );
        }
        return Object.entries(jenisObj).map(([jenisNilaiKey, detail]) => ({
          peserta_modul_id: pesertaModul.id,
          praktikum_id: praktikumId,
          jenis_nilai: detail.jenisNilai || jenisNilaiKey || "",
          nilai: Number(parseFloat(detail.nilai).toFixed(2)),
        }));
      });

      await prisma.penilaianProsesPraktikumDetail.createMany({
        data: prosesPraktikumData,
        skipDuplicates: true,
      });
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  static async getHasilInputPenilaian(
    userId: number,
    role: string,
    namaModul: string,
    nim: string
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

      const trimmedNamaModul = namaModul.trim();

      const pesertaSchema2 = await prismaMysql.mda_master_mahasiswa.findFirst({
        where: { nim },
      });

      let pesertaSchema1;
      if (!pesertaSchema2) {
        pesertaSchema1 = await prisma.mahasiswa.findFirst({
          where: { nim },
        });
      }

      const peserta = pesertaSchema2 || pesertaSchema1;
      if (!peserta) {
        throw new Error("Peserta not found");
      }

      const pesertaModul = await prisma.pesertaModul.findFirst({
        where: {
          nim,
          modul: {
            nama_modul: trimmedNamaModul,
          },
        },
      });

      if (!pesertaModul) {
        throw new Error("Peserta not registered in any modul");
      }

      const modulId = pesertaModul.modul_id;

      const modul = await prisma.modul.findFirst({
        where: { id: modulId },
        include: {
          modul_praktikums: {
            include: {
              praktikum: true,
            },
          },
          penilaian_moduls: true,
          pemicus: true,
          kelompoks: {
            include: {
              anggotas: true,
            },
          },
        },
      });

      if (!modul) {
        throw new Error("Modul not found for this peserta");
      }

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

      const kelompok_nomor = pesertaKelompokMap[pesertaModul.id] || null;

      const penilaianSumatif = await prisma.penilaianSumatif.findFirst({
        where: { peserta_modul_id: pesertaModul.id },
      });

      if (!penilaianSumatif) {
        throw new Error("Penilaian sumatif not found for this peserta");
      }

      const totalSoalSum1 =
        Number(modul.penilaian_moduls[0]?.total_soal_sum1) || 0;
      const totalSoalSum2 =
        Number(modul.penilaian_moduls[0]?.total_soal_sum2) || 0;
      const totalHerSum1 =
        Number(modul.penilaian_moduls[0]?.total_her_sum1) || 0;
      const totalHerSum2 =
        Number(modul.penilaian_moduls[0]?.total_her_sum2) || 0;

      if (totalSoalSum1 === 0 || totalSoalSum2 === 0) {
        throw new Error("Total soal sumatif tidak valid");
      }

      const rataRataSumatif = Number(
        (
          ((penilaianSumatif.total_benar_sum1 / totalSoalSum1) * 100 +
            (penilaianSumatif.total_benar_sum2 / totalSoalSum2) * 100) /
          2
        ).toFixed(2)
      );

      let rataRataHerSumatif = 0;
      if (totalHerSum1 > 0 && totalHerSum2 > 0) {
        rataRataHerSumatif = Number(
          (
            ((penilaianSumatif.total_benar_her_sum1! / totalHerSum1) * 100 +
              (penilaianSumatif.total_benar_her_sum2! / totalHerSum2) * 100) /
            2
          ).toFixed(2)
        );
      }

      const nilaiAkhirSumatif = Number(
        (totalHerSum1 > 0 && totalHerSum2 > 0
          ? Math.max(rataRataSumatif, rataRataHerSumatif)
          : rataRataSumatif
        ).toFixed(2)
      );

      const penilaianProses = await prisma.penilaianProses.findFirst({
        where: { peserta_modul_id: pesertaModul.id },
      });

      if (!penilaianProses) {
        throw new Error("Penilaian proses not found for this peserta");
      }

      const diskusiKelompokDetail =
        await prisma.penilaianDiskusiKelompok.findMany({
          where: { peserta_modul_id: pesertaModul.id },
        });

      const dkValues: { [key: string]: number[] } = {};
      const dkDetail = diskusiKelompokDetail.map((entry) => {
        const key = `${entry.kelompok_id}-P${entry.pemicu_id}`;
        const kelompok = entry.kelompok_id;
        if (!dkValues[kelompok]) dkValues[kelompok] = [];
        dkValues[kelompok].push(Number(entry.nilai));
        return { key, nilai: Number(entry.nilai.toFixed(2)) };
      });

      const rataRataDK1 = Number(
        (dkValues["DK1"]?.length > 0
          ? dkValues["DK1"].reduce((sum, val) => sum + val, 0) /
            dkValues["DK1"].length
          : 0
        ).toFixed(2)
      );
      const rataRataDK2 = Number(
        (dkValues["DK2"]?.length > 0
          ? dkValues["DK2"].reduce((sum, val) => sum + val, 0) /
            dkValues["DK2"].length
          : 0
        ).toFixed(2)
      );
      const nilaiAkhirDK = Number(
        ((rataRataDK1 + rataRataDK2) / 2 || 0).toFixed(2)
      );

      const bukuCatatanDetail = await prisma.penilaianBukuCatatan.findMany({
        where: { peserta_modul_id: pesertaModul.id },
      });

      const temuPakarDetail = await prisma.penilaianTemuPakar.findMany({
        where: { peserta_modul_id: pesertaModul.id },
      });

      const petaKonsepDetail = await prisma.penilaianPetaKonsep.findMany({
        where: { peserta_modul_id: pesertaModul.id },
      });

      const prosesPraktikumDetail =
        await prisma.penilaianProsesPraktikumDetail.findMany({
          where: { peserta_modul_id: pesertaModul.id },
          include: {
            praktikum: true,
          },
        });

      const penilaianPraktikum = await prisma.penilaianPraktikum.findMany({
        where: { peserta_modul_id: pesertaModul.id },
        include: {
          praktikum: true,
        },
      });

      if (!penilaianPraktikum || penilaianPraktikum.length === 0) {
        throw new Error("Penilaian praktikum not found for this peserta");
      }

      const praktikumData = penilaianPraktikum.map((p) => ({
        praktikum_id: p.praktikum_id,
        nama_praktikum: p.praktikum.nama,
        nilai: Number(p.nilai.toFixed(2)),
        nilaiHer: Number(p.nilai_her.toFixed(2)),
        nilaiAkhir: Number(p.nilai_akhir.toFixed(2)),
      }));

      const rataRataPraktikum = Number(
        (
          praktikumData.reduce((sum, p) => sum + p.nilai, 0) /
          praktikumData.length
        ).toFixed(2)
      );
      const rataRataHerPraktikum = Number(
        (
          praktikumData.reduce((sum, p) => sum + p.nilaiHer, 0) /
          praktikumData.length
        ).toFixed(2)
      );
      const nilaiAkhirPraktikum = Number(
        ((rataRataPraktikum + rataRataHerPraktikum) / 2).toFixed(2)
      );

      const penilaianAkhir = await prisma.penilaianAkhir.findFirst({
        where: { peserta_modul_id: pesertaModul.id },
      });

      if (!penilaianAkhir) {
        throw new Error("Penilaian akhir not found for this peserta");
      }

      const petaKonsepPerPemicu: { [key: number]: number[] } = {};
      petaKonsepDetail.forEach((entry) => {
        if (!petaKonsepPerPemicu[entry.pemicu_id]) {
          petaKonsepPerPemicu[entry.pemicu_id] = [];
        }
        petaKonsepPerPemicu[entry.pemicu_id].push(Number(entry.nilai));
      });

      const rataRataPerPemicu = Object.keys(petaKonsepPerPemicu).reduce(
        (acc, pemicu) => {
          const nilaiPemicu = petaKonsepPerPemicu[Number(pemicu)];
          const rataRata =
            nilaiPemicu.length > 0
              ? Number(
                  (
                    nilaiPemicu.reduce((sum, val) => sum + val, 0) /
                    nilaiPemicu.length
                  ).toFixed(2)
                )
              : 0;
          acc[Number(pemicu)] = rataRata;
          return acc;
        },
        {} as { [key: number]: number }
      );

      const nilaiAkhirTotal = Number(penilaianAkhir.nilai_akhir.toFixed(2));
      let tingkat: string;
      if (nilaiAkhirTotal >= 80) {
        tingkat = "A";
      } else if (nilaiAkhirTotal >= 70) {
        tingkat = "B";
      } else if (nilaiAkhirTotal >= 60) {
        tingkat = "C";
      } else if (nilaiAkhirTotal >= 50) {
        tingkat = "D";
      } else {
        tingkat = "E";
      }

      return {
        data: {
          nama_siswa: pesertaSchema2
            ? String(pesertaSchema2.nama_mahasiswa)
            : `${pesertaSchema1?.nama_depan} ${
                pesertaSchema1?.nama_belakang || ""
              }`.trim(),
          modul: modul.nama_modul,
          kelompok_nomor: kelompok_nomor,
          inputPenilaian: {
            totalBenarSumatif1: penilaianSumatif.total_benar_sum1,
            totalBenarSumatif2: penilaianSumatif.total_benar_sum2,
            totalBenarHerSumatif1: penilaianSumatif.total_benar_her_sum1,
            totalBenarHerSumatif2: penilaianSumatif.total_benar_her_sum2,
            diskusiKelompok: Object.fromEntries(
              dkDetail.map((d) => [d.key, d.nilai])
            ),
            bukuCatatan: Object.fromEntries(
              bukuCatatanDetail.map((d) => [
                d.label,
                Number(d.nilai.toFixed(2)),
              ])
            ),
            temuPakar: Object.fromEntries(
              temuPakarDetail.map((d) => [d.label, Number(d.nilai.toFixed(2))])
            ),
            petaKonsep: petaKonsepDetail.reduce((acc, d) => {
              if (!acc[d.pemicu_id]) acc[d.pemicu_id] = {};
              acc[d.pemicu_id][d.ilmu] = {
                dokter: d.dokter,
                nilai: Number(d.nilai.toFixed(2)),
              };
              return acc;
            }, {} as Record<string, Record<string, { dokter: string; nilai: number }>>),
            prosesPraktikum: Object.fromEntries(
              prosesPraktikumDetail.map((d) => [
                `${d.praktikum.nama}-${d.jenis_nilai}`,
                {
                  jenisNilai: d.jenis_nilai,
                  nilai: Number(d.nilai.toFixed(2)),
                },
              ])
            ),
            nilaiPraktikum: Object.fromEntries(
              praktikumData.map((p) => [
                String(p.praktikum_id),
                Number(p.nilai.toFixed(2)),
              ])
            ),
            nilaiHerPraktikum: Object.fromEntries(
              praktikumData.map((p) => [
                String(p.praktikum_id),
                Number(p.nilaiHer.toFixed(2)),
              ])
            ),
          },
          nilaiSumatif: {
            rataRataSumatif: Number(rataRataSumatif.toFixed(2)),
            rataRataHerSumatif: Number(rataRataHerSumatif.toFixed(2)),
            nilaiAkhir: Number(nilaiAkhirSumatif.toFixed(2)),
          },
          nilaiProses: {
            diskusiKelompok: {
              dk1: Number(rataRataDK1.toFixed(2)),
              dk2: Number(rataRataDK2.toFixed(2)),
              nilaiAkhir: Number(nilaiAkhirDK.toFixed(2)),
              detail: dkDetail,
            },
            bukuCatatan: {
              nilaiAkhir: Number(penilaianProses.buku_catatan.toFixed(2)),
              detail: bukuCatatanDetail.map((d) => ({
                label: d.label,
                nilai: Number(d.nilai.toFixed(2)),
              })),
            },
            temuPakar: {
              nilaiAkhir: Number(penilaianProses.temu_pakar.toFixed(2)),
              detail: temuPakarDetail.map((d) => ({
                label: d.label,
                nilai: Number(d.nilai.toFixed(2)),
              })),
            },
            petaKonsep: {
              nilaiAkhir: Number(penilaianProses.peta_konsep.toFixed(2)),
              rataRataPerPemicu: rataRataPerPemicu,
              detail: petaKonsepDetail.map((d) => ({
                pemicu: d.pemicu_id,
                ilmu: d.ilmu,
                dokter: d.dokter,
                nilai: Number(d.nilai.toFixed(2)),
              })),
            },
            prosesPraktikum: {
              nilaiAkhir: Number(penilaianProses.proses_praktikum.toFixed(2)),
              detail: prosesPraktikumDetail.map((d) => ({
                praktikum_id: d.praktikum_id,
                nama_praktikum: d.praktikum.nama,
                jenis_nilai: d.jenis_nilai,
                nilai: Number(d.nilai.toFixed(2)),
              })),
            },
            nilaiAkhir: Number(penilaianProses.nilai_akhir.toFixed(2)),
          },
          nilaiPraktikum: {
            praktikum: praktikumData,
            rataRataPraktikum: Number(rataRataPraktikum.toFixed(2)),
            rataRataHerPraktikum: Number(rataRataHerPraktikum.toFixed(2)),
            nilaiAkhirPraktikum: Number(nilaiAkhirPraktikum.toFixed(2)),
          },
          nilaiAkhir: {
            nilai: Number(penilaianAkhir.nilai_akhir.toFixed(2)),
            tingkat,
          },
        },
      };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  static async getModulDetailHasilPenilaian(
    userId: number,
    role: string,
    namaModul: string,
    page: number = 1,
    limit: number = 10,
    searchSiswa: string = "",
    searchNim: string = "",
    sortOrder: "asc" | "desc" = "asc",
    tingkatFilter: "A" | "B" | "C" | "D" | "E" | "" = ""
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

      const modul = await prisma.modul.findFirst({
        where: { nama_modul: namaModul },
      });

      if (!modul) {
        throw new Error(`Modul dengan nama "${namaModul}" tidak ditemukan`);
      }

      const pesertaModul = await prisma.pesertaModul.findMany({
        where: {
          modul_id: modul.id,
        },
        include: {
          penilaian_sumatif: true,
          penilaian_praktikum: true,
          penilaian_akhir: {
            select: {
              id: true,
              nilai_sumatif: true,
              nilai_praktikum: true,
              nilai_proses: true,
              nilai_akhir: true,
              created_at: true,
            },
          },
        },
      });

      if (!pesertaModul || pesertaModul.length === 0) {
        throw new Error(
          `Tidak ada peserta yang ditemukan untuk modul "${namaModul}"`
        );
      }

      const pesertaDataPromises = pesertaModul.map(async (pm) => {
        const pesertaSchema2 = await prismaMysql.mda_master_mahasiswa.findFirst(
          {
            where: { nim: pm.nim },
          }
        );

        let pesertaSchema1;
        if (!pesertaSchema2) {
          pesertaSchema1 = await prisma.mahasiswa.findFirst({
            where: { nim: pm.nim },
          });
        }

        const peserta = pesertaSchema2 || pesertaSchema1;
        if (!peserta) {
          return null;
        }

        return {
          pesertaModul: pm,
          nama_siswa: pesertaSchema2
            ? String(pesertaSchema2.nama_mahasiswa)
            : `${pesertaSchema1?.nama_depan} ${
                pesertaSchema1?.nama_belakang || ""
              }`.trim(),
          nim: pm.nim,
        };
      });

      const pesertaDataResults = await Promise.all(pesertaDataPromises);
      const validPesertaData = pesertaDataResults.filter(
        (data) => data !== null
      ) as Array<{
        pesertaModul: (typeof pesertaModul)[0];
        nama_siswa: string;
        nim: string;
      }>;

      if (validPesertaData.length === 0) {
        throw new Error(
          `Tidak ada data peserta yang valid untuk modul "${namaModul}"`
        );
      }

      let resultData = validPesertaData
        .map((data) => {
          const pm = data.pesertaModul;

          const nilaiAkhirSumatif = pm.penilaian_sumatif
            ? Number(pm.penilaian_sumatif.nilai_akhir.toFixed(2))
            : 0;

          const nilaiAkhirPraktikum =
            pm.penilaian_praktikum.length > 0
              ? Number(
                  (
                    pm.penilaian_praktikum.reduce(
                      (sum, p) => sum + Number(p.nilai_akhir),
                      0
                    ) / pm.penilaian_praktikum.length
                  ).toFixed(2)
                )
              : 0;

          const nilaiAkhirModul = pm.penilaian_akhir
            ? Number(pm.penilaian_akhir.nilai_akhir.toFixed(2))
            : 0;

          let tingkatAkhir: string;
          if (nilaiAkhirModul >= 80) {
            tingkatAkhir = "A";
          } else if (nilaiAkhirModul >= 70) {
            tingkatAkhir = "B";
          } else if (nilaiAkhirModul >= 60) {
            tingkatAkhir = "C";
          } else if (nilaiAkhirModul >= 50) {
            tingkatAkhir = "D";
          } else {
            tingkatAkhir = "E";
          }

          const createdAt = pm.penilaian_akhir?.created_at || new Date();

          return {
            nama_siswa: data.nama_siswa,
            nim: data.nim,
            nilai_akhir_sumatif: nilaiAkhirSumatif,
            nilai_akhir_praktikum: nilaiAkhirPraktikum,
            tingkat_akhir: tingkatAkhir,
            created_at: createdAt,
            nilai_akhir_modul: nilaiAkhirModul,
          };
        })
        .filter((item) => {
          const matchSiswa = searchSiswa
            ? item.nama_siswa.toLowerCase().includes(searchSiswa.toLowerCase())
            : true;
          const matchNim = searchNim
            ? item.nim.toLowerCase().includes(searchNim.toLowerCase())
            : true;
          const matchTingkat = tingkatFilter
            ? item.tingkat_akhir === tingkatFilter
            : true;

          return matchSiswa && matchNim && matchTingkat;
        })
        .sort((a, b) => {
          if (sortOrder === "asc") {
            return a.nilai_akhir_modul - b.nilai_akhir_modul;
          } else {
            return b.nilai_akhir_modul - a.nilai_akhir_modul;
          }
        })
        .map(({ nilai_akhir_modul, ...rest }) => rest);

      const total = resultData.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const data = resultData.slice(startIndex, endIndex);

      return {
        data,
        totalItems: total,
        currentPag: page,
        pageSize: limit,
        totalPages,
      };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export default PenilaianModulServices;
