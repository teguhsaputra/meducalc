import prisma from "../../lib/db1";
import prismaMysql from "../../lib/db2";
import { JenisKelamin } from "../../lib/prisma/generated/schema1";
import bcrypt from "bcrypt";

class MahasiswaServices {
  static async getMahasiswa(
    userId: number,
    role: string,
    page: number = 1,
    limit: number = 1,
    search: string = ""
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

      const processedSearch = search.trim();

      const mahasiswaSchema1 = await prisma.mahasiswa.findMany({
        select: {
          id: true,
          nama_depan: true,
          nama_belakang: true,
          nim: true,
          angkatan: true,
          username: true,
        },
      });

      const mahasiswaSchema2 = await prismaMysql.set_user.findMany({
        where: {
          tingkat_user: "mahasiswa",
        },
        select: {
          id: true,
          username: true,
          nama: true,
          id_mahasiswa: true,
        },
      });

      const masterMahasiswa = await prismaMysql.mda_master_mahasiswa.findMany({
        select: {
          id: true,
          nama_mahasiswa: true,
          nim: true,
          angkatan: true,
        },
      });

      const mahasiswaSchema2WithNimAngkatan = mahasiswaSchema2.map((user) => {
        const masterData = masterMahasiswa.find(
          (m) => m.id === user.id_mahasiswa
        );
        if (!masterData) {
          console.log(`No match found for id_mahasiswa: ${user.id_mahasiswa}`);
        }
        const rawUsername = user.username || "";
        const nim = masterData?.nim || "";
        const derivedUsername =
          rawUsername && rawUsername !== nim
            ? rawUsername
            : (masterData?.nama_mahasiswa || user.nama || "")
                .toLowerCase()
                .replace(/\s+/g, "_") || `user_${user.id_mahasiswa}`;

        const result = {
          id: user.id_mahasiswa || user.id,
          nama_siswa: masterData?.nama_mahasiswa || user.nama || "",
          nim: masterData?.nim || "",
          angkatan: masterData?.angkatan || "",
          username: derivedUsername,
        };
        return result;
      });

      const allMahasiswa = [
        ...mahasiswaSchema1.map((m) => ({
          id: m.id,
          nama_siswa: `${m.nama_depan} ${m.nama_belakang || ""}`.trim(),
          nim: m.nim,
          angkatan: m.angkatan,
          username: m.username,
        })),
        ...mahasiswaSchema2WithNimAngkatan,
      ];

      const filteredMahasiswa = allMahasiswa.filter(
        (m) =>
          !processedSearch ||
          m.nama_siswa?.toLowerCase().includes(processedSearch.toLowerCase()) ||
          m.nim?.toLowerCase().includes(processedSearch.toLowerCase()) ||
          m.angkatan?.toString().includes(processedSearch)
      );

      const uniqueMahasiswa = Array.from(
        new Map(filteredMahasiswa.map((item) => [item.id, item])).values()
      );

      const total = uniqueMahasiswa.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const data = uniqueMahasiswa.slice(startIndex, startIndex + limit);

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

  static async getAllMahasiswa(
    userId: number,
    role: string,
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

      const isSearching = searchSiswa || searchNim || searchAngkatan;
      const skip = isSearching ? 0 : (page - 1) * limit;
      const appliedLimit = isSearching ? undefined : limit;

      const angkatanValue = searchAngkatan
        ? parseInt(searchAngkatan)
        : undefined;

      const mahasiswaSchema1 = await prisma.mahasiswa.findMany({
        where: {
          peserta_moduls: {
            some: {
              mahasiswa: {
                AND: [
                  searchSiswa
                    ? {
                        OR: [
                          {
                            nama_depan: {
                              contains: searchSiswa,
                            },
                          },
                          {
                            nama_belakang: {
                              contains: searchSiswa,
                            },
                          },
                        ],
                      }
                    : undefined,
                  searchNim ? { nim: { contains: searchNim } } : undefined,
                  angkatanValue !== undefined
                    ? { angkatan: angkatanValue }
                    : undefined,
                ].filter((clause) => clause !== undefined),
              },
            },
          },
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
        created_at: m.created_at, // Untuk pengurutan
      }));

      const totalSiswaSchema1 = dataSchema1.length;

      const mahasiswaSchema2 = await prismaMysql.mda_master_mahasiswa.findMany({
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
          created_at: m.waktu_dibuat, // Untuk pengurutan
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

      const finalData = appliedLimit
        ? combinedData.slice(skip, skip + appliedLimit)
        : combinedData;

      const data = finalData.map((m) => ({
        nama_siswa: m.nama,
        nim: m.nim,
        angkatan: m.angkatan,
        username: m.username,
      }));

      const totalSiswa = totalSiswaSchema1 + totalSiswaSchema2;
      const totalPages = appliedLimit
        ? Math.ceil(totalSiswa / appliedLimit)
        : 1;

      return {
        data,
        totalItems: totalSiswa,
        totalPages: isSearching ? 1 : totalPages,
        currentPage: isSearching ? 1 : page,
        pageSize: isSearching ? totalSiswa : limit,
      };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  static async getDetailMahasiswaByNim(
    userId: number,
    role: string,
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

      const mahasiswaSchema1 = await prisma.mahasiswa.findFirst({
        where: { nim },
        select: {
          nama_depan: true,
          nama_belakang: true,
          tanggal_lahir: true,
          jenis_kelamin: true,
          nim: true,
          angkatan: true,
        },
      });

      const mahasiswaSchema2 = await prismaMysql.mda_master_mahasiswa.findFirst(
        {
          where: { nim },
          select: {
            nama_mahasiswa: true,
            tgl_lahir: true,
            nim: true,
            angkatan: true,
          },
        }
      );

      if (!mahasiswaSchema1 && !mahasiswaSchema2) {
        throw new Error("Mahasiswa not found");
      }

      const pesertaModul = await prisma.pesertaModul.findFirst({
        where: { nim },
        include: {
          modul: {
            select: {
              id: true,
              nama_modul: true,
              tahun_mulai: true,
              tahun_selesai: true,
            },
          },
        },
      });

      const splitName = (fullName: string | null) => {
        if (!fullName) return { nama_depan: "N/A", nama_belakang: "N/A" };
        const nameParts = fullName.trim().split(/\s+/);
        if (nameParts.length <= 1) {
          return { nama_depan: nameParts[0] || "N/A", nama_belakang: "" };
        }
        const nama_belakang = nameParts[nameParts.length - 1];
        const nama_depan = nameParts.slice(0, -1).join(" ");
        return { nama_depan, nama_belakang };
      };

      let nama_depan = mahasiswaSchema1?.nama_depan || "";
      let nama_belakang = mahasiswaSchema1?.nama_belakang || "";
      let tanggal_lahir =
        mahasiswaSchema1?.tanggal_lahir || mahasiswaSchema2?.tgl_lahir || null;
      let jenis_kelamin = mahasiswaSchema1?.jenis_kelamin || "";
      let angkatan =
        mahasiswaSchema1?.angkatan?.toString() ||
        mahasiswaSchema2?.angkatan?.toString() ||
        "";
      const nimMahasiswa =
        mahasiswaSchema1?.nim || mahasiswaSchema2?.nim || nim;

      if (
        !mahasiswaSchema1?.nama_depan &&
        !mahasiswaSchema1?.nama_belakang &&
        mahasiswaSchema2?.nama_mahasiswa
      ) {
        const { nama_depan: depan, nama_belakang: belakang } = splitName(
          mahasiswaSchema2.nama_mahasiswa
        );
        nama_depan = depan;
        nama_belakang = belakang;
      }

      let tanggalLahirFormatted = { hari: "", bulan: "", tahun: "" };
      if (tanggal_lahir) {
        const date = new Date(tanggal_lahir);
        if (!isNaN(date.getTime())) {
          tanggalLahirFormatted = {
            hari: date.getDate().toString().padStart(2, "0"),
            bulan: (date.getMonth() + 1).toString().padStart(2, "0"),
            tahun: date.getFullYear().toString(),
          };
        }
      }

      const modulTerdaftar = pesertaModul?.modul
        ? [
            {
              id: pesertaModul.modul.id,
              nama_modul: pesertaModul.modul.nama_modul || "",
              tahun_ajaran:
                pesertaModul.modul.tahun_mulai &&
                pesertaModul.modul.tahun_selesai
                  ? `${pesertaModul.modul.tahun_mulai}/${pesertaModul.modul.tahun_selesai}`
                  : "",
            },
          ]
        : [];

      console.log("modulTerdaftar:", modulTerdaftar);

      return {
        nama_depan,
        nama_belakang,
        tanggal_lahir: tanggalLahirFormatted,
        data_kampus: {
          jenis_kelamin,
          nim: nimMahasiswa,
          angkatan,
        },
        modul_terdaftar: modulTerdaftar,
      };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  static async addMahasiswa(
    userId: number,
    role: string,
    namaDepan: string,
    namaBelakang: string,
    tanggalLahir: string,
    jenisKelamin: JenisKelamin,
    nim: string,
    angkatan: number,
    username: string,
    password: string
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

      const existingMahasiswa = await prisma.mahasiswa.findUnique({
        where: {
          username,
        },
      });

      if (existingMahasiswa) {
        throw new Error("Username sudah ada");
      }

      const parsedDate = new Date(tanggalLahir);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newMahasiswa = await prisma.mahasiswa.create({
        data: {
          nama_depan: namaDepan,
          nama_belakang: namaBelakang,
          tanggal_lahir: parsedDate,
          jenis_kelamin: jenisKelamin,
          nim,
          angkatan,
          username,
          password: hashedPassword,
        },
      });

      return newMahasiswa;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  static async editMahasiswaById(
    userId: number,
    role: string,
    mahasiswaId: number,
    namaDepan: string,
    namaBelakang: string,
    tanggalLahir: string,
    jenisKelamin: JenisKelamin,
    nim: string,
    angkatan: number,
    username: string
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

      const existingMahasiswa = await prisma.mahasiswa.findUnique({
        where: {
          id: mahasiswaId,
        },
      });

      if (!existingMahasiswa) {
        throw new Error("Mahasiswa not found");
      }

      const usernameTaken = await prisma.mahasiswa.findFirst({
        where: {
          username,
          id: { not: mahasiswaId },
        },
      });

      if (usernameTaken) {
        throw new Error("Username sudah ada");
      }

      const parsedDate = new Date(tanggalLahir);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format");
      }

      const updatedMahasiswa = await prisma.mahasiswa.update({
        where: { id: mahasiswaId },
        data: {
          nama_depan: namaDepan,
          nama_belakang: namaBelakang,
          tanggal_lahir: parsedDate,
          jenis_kelamin: jenisKelamin,
          nim,
          angkatan,
          username,
        },
      });

      return updatedMahasiswa;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  static async getMahasiswaById(
    userId: number,
    role: string,
    mahasiswaId: number
  ) {
    try {
      console.log("mahasiswa id", mahasiswaId);
      if (role === "admin") {
        const existingAdmin = await prisma.admin.findUnique({
          where: { id: userId },
        });

        if (!existingAdmin) {
          throw new Error("Admin not found");
        }
      }

      const mahasiswa = await prisma.mahasiswa.findUnique({
        where: { id: mahasiswaId },
        select: {
          id: true,
          nama_depan: true,
          nama_belakang: true,
          tanggal_lahir: true,
          jenis_kelamin: true,
          nim: true,
          angkatan: true,
          username: true,
        },
      });

      if (!mahasiswa) {
        throw new Error("Mahasiswa not found");
      }

      return mahasiswa;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  // modul
  static async getModulMahasiswa(
    userId: number,
    role: string,
    page: number = 1,
    limit: number = 10,
    searchModul: string = "",
    searchTahunAjaran: string = ""
  ) {
    try {
      let mahasiswaId: number | null = null;
      let prismaClient: typeof prisma | typeof prismaMysql;

      if (role === "mahasiswa") {
        const existingMahasiswa = await prisma.mahasiswa.findUnique({
          where: { id: userId },
          select: { id: true, nim: true },
        });
        if (!existingMahasiswa) {
          throw new Error("Mahasiswa not found in schema 1");
        }
        mahasiswaId = existingMahasiswa.id;
        prismaClient = prisma;
      } else if (role === "set_user_mahasiswa") {
        const existingMahasiswaSchema2 = await prismaMysql.set_user.findFirst({
          where: { id: userId },
          select: { id: true },
        });
        if (!existingMahasiswaSchema2) {
          throw new Error("Mahasiswa not found in schema 2");
        }
        mahasiswaId = existingMahasiswaSchema2.id;
        prismaClient = prismaMysql;
      } else {
        throw new Error(
          "Access denied: Role must be 'mahasiswa' or 'set_user_mahasiswa'"
        );
      }

      const skip = (page - 1) * limit;

      // Filter untuk search
      const whereClause: any = {
        mahasiswaId,
        modul: {
          ...(searchModul && {
            nama_modul: searchModul,
          }),
          ...(searchTahunAjaran && {
            AND: [
              { tahun_mulai: parseInt(searchTahunAjaran.split("/")[0]) || 0 },
              { tahun_selesai: parseInt(searchTahunAjaran.split("/")[1]) || 0 },
            ],
          }),
        },
      };

      const pesertaModul = await prisma.pesertaModul.findMany({
        where: whereClause,
        select: {
          id: true,
          nim: true,
          kelompok_anggotas: {
            select: {
              kelompok: {
                select: {
                  nama_kelompok: true,
                },
              },
            },
          },
          modul: {
            select: {
              nama_modul: true,
              tahun_mulai: true,
              tahun_selesai: true,
              peserta_moduls: {
                select: {
                  id: true,
                  nim: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
      });

      const total = await prisma.pesertaModul.count({
        where: whereClause,
      });

      const allPesertaModul = await prisma.pesertaModul.findMany({
        where: { mahasiswaId: mahasiswaId },
        select: {
          modul: {
            select: {
              nama_modul: true,
              tahun_mulai: true,
              tahun_selesai: true,
            },
          },
        },
      });

      const modulOptions = [
        ...new Set(allPesertaModul.map((p) => p.modul.nama_modul)),
      ].sort();
      const tahunAjaranOptions = [
        ...new Set(
          allPesertaModul.map(
            (p) => `${p.modul.tahun_mulai}/${p.modul.tahun_selesai}`
          )
        ),
      ].sort();

      const data = pesertaModul.map((peserta) => {
        const kelompokNomor =
          peserta.kelompok_anggotas.length > 0
            ? peserta.kelompok_anggotas[0]?.kelompok?.nama_kelompok?.match(
                /Kelompok (\d+)/
              )?.[1]
              ? parseInt(
                  peserta.kelompok_anggotas[0].kelompok.nama_kelompok.match(
                    /Kelompok (\d+)/
                  )![1],
                  10
                )
              : null
            : null;

        return {
          nim: peserta.nim,
          nama_modul: peserta.modul.nama_modul,
          tahun_ajaran: `${peserta.modul.tahun_mulai}/${peserta.modul.tahun_selesai}`,
          kelompok_nomor: kelompokNomor,
          total_siswa: peserta.modul.peserta_moduls.length,
        };
      });

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        options: {
          modulOptions,
          tahunAjaranOptions,
        },
      };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  static async getHasilPenilaianByNimMahasiswa(
    userId: number,
    role: string,
    nim: string
  ) {
    try {
      let mahasiswaId: number | null = null;
      let prismaClient: typeof prisma | typeof prismaMysql;

      if (role === "mahasiswa") {
        const existingMahasiswa = await prisma.mahasiswa.findUnique({
          where: { id: userId },
          select: { id: true, nim: true },
        });
        if (!existingMahasiswa) {
          throw new Error("Mahasiswa not found in schema 1");
        }
        mahasiswaId = existingMahasiswa.id;
        prismaClient = prisma;
      } else if (role === "set_user_mahasiswa") {
        const existingMahasiswaSchema2 = await prismaMysql.set_user.findFirst({
          where: { id: userId },
          select: { id: true },
        });
        if (!existingMahasiswaSchema2) {
          throw new Error("Mahasiswa not found in schema 2");
        }
        mahasiswaId = existingMahasiswaSchema2.id;
        prismaClient = prismaMysql;
      } else {
        throw new Error(
          "Access denied: Role must be 'mahasiswa' or 'set_user_mahasiswa'"
        );
      }

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
        where: { nim },
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

      const petaKoncepDetail = await prisma.penilaianPetaKonsep.findMany({
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

      const petaKoncepPerPemicu: { [key: number]: number[] } = {};
      petaKoncepDetail.forEach((entry) => {
        if (!petaKoncepPerPemicu[entry.pemicu_id]) {
          petaKoncepPerPemicu[entry.pemicu_id] = [];
        }
        petaKoncepPerPemicu[entry.pemicu_id].push(Number(entry.nilai));
      });

      const rataRataPerPemicu = Object.keys(petaKoncepPerPemicu).reduce(
        (acc, pemicu) => {
          const nilaiPemicu = petaKoncepPerPemicu[Number(pemicu)];
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
            petaKoncep: petaKoncepDetail.reduce((acc, d) => {
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
            petaKoncep: {
              nilaiAkhir: Number(penilaianProses.peta_konsep.toFixed(2)),
              rataRataPerPemicu: rataRataPerPemicu,
              detail: petaKoncepDetail.map((d) => ({
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
}

export default MahasiswaServices;
