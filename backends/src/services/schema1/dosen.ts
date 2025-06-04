import prisma from "../../lib/db1";
import prismaMysql from "../../lib/db2";
import bcrypt from "bcrypt";

interface CountResult {
  count: number;
}

class DosenServices {
  static async getIlmuAndDosen() {
    try {
      const ilmu = await prisma.ilmu.findMany({
        select: {
          id: true,
          nama_ilmu: true,
        },
      });

      const dosenSchema1 = await prisma.dosen.findMany({
        select: {
          id: true,
          nama_depan: true,
        },
      });

      const dosenSchema2 = await prismaMysql.mda_master_dosen.findMany({
        select: {
          id: true,
          nama_dosen: true,
        },
      });

      const combinedDosen = Array.from(
        new Map(
          [...dosenSchema1, ...dosenSchema2].map((dosen) => [dosen.id, dosen])
        ).values()
      );

      return { ilmu, dosen: combinedDosen };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  static async getDosenModul(
    userId: number,
    role: string,
    page: number = 1,
    pageSize: number = 10,
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

      const modulList = await prisma.modul.findMany({
        where: {
          penanggung_jawab: {
            contains: search,
            mode: "insensitive",
          },
        },
        include: {
          Dosen: {
            select: {
              id: true,
              nama_depan: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });

      const groupedByPenanggungJawab = modulList.reduce((acc: any, modul) => {
        const namaDosen =
          modul.penanggung_jawab || "Tidak ada penanggung jawab";

        if (!acc[namaDosen]) {
          acc[namaDosen] = {
            nama_dosen: namaDosen,
            total_modul: 0,
            modul_id: modul.id,
          };
        }
        acc[namaDosen].total_modul += 1;
        return acc;
      }, {});

      let result = Object.values(groupedByPenanggungJawab);
      const totalItems = result.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      const start = (page - 1) * pageSize;
      const data = result.slice(start, start + pageSize);

      return {
        data,
        totalItems,
        totalPages,
        currentPage: page,
        pageSize,
      };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  static async getModulByDosen(
    userId: number,
    role: string,
    page: number = 1,
    limit: number = 10,
    searchModul: string = "",
    searchSchoolYear: string = "",
    penanggungJawab: string
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
        penanggung_jawab: penanggungJawab,
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
        skip,
        take: limit,
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
      }));

      // Filter untuk schema 2 (MySQL - ist_daftar_modul)
      let modulsSchema2: any[] = [];
      let totalModulSchema2 = 0;

      const totalQuery = prismaMysql.$queryRaw<CountResult[]>`
      SELECT COUNT(*) as count FROM ist_daftar_modul
      WHERE tim_modul = ${penanggungJawab}
      ${
        searchModul
          ? prismaMysql.$queryRaw`AND nama_modul LIKE ${`%${searchModul}%`}`
          : ""
      }
      ${
        searchSchoolYear
          ? prismaMysql.$queryRaw`AND tahun_akademik LIKE ${`%${searchSchoolYear}%`}`
          : ""
      }
    `;
      if (totalModulSchema2 > 0) {
        modulsSchema2 = await prismaMysql.$queryRaw`
        SELECT * FROM ist_daftar_modul
        WHERE tim_modul = ${penanggungJawab}
        ${
          searchModul
            ? prismaMysql.$queryRaw`AND nama_modul LIKE ${`%${searchModul}%`}`
            : ""
        }
        ${
          searchSchoolYear
            ? prismaMysql.$queryRaw`AND tahun_akademik LIKE ${`%${searchSchoolYear}%`}`
            : ""
        }
        ORDER BY waktu_dibuat DESC
        LIMIT ${limit} OFFSET ${skip}
      `;
      }

      const dataSchema2 = modulsSchema2.map((modul: any) => ({
        id: modul.id,
        nama_modul: modul.nama_modul || "N/A",
        tahun_ajaran: modul.tahun_akademik || "N/A",
        total_siswa: 0,
      }));

      const data = [...dataSchema1, ...dataSchema2];

      // Total keseluruhan
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

  static async addDosen(
    userId: number,
    role: string,
    namaDepan: string,
    tanggalLahir: Date,
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

      const existingDosen = await prisma.dosen.findUnique({
        where: {
          username,
        },
      });

      if (existingDosen) {
        throw new Error("Username sudah ada");
      }

      const parsedDate = new Date(tanggalLahir);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newDosen = await prisma.dosen.create({
        data: {
          nama_depan: namaDepan,
          tanggal_lahir: parsedDate,
          username,
          password: hashedPassword,
        },
      });

      return newDosen;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  static async getModulDosen(
    userId: number,
    role: string,
    page: number = 1,
    limit: number = 10,
    searchModul: string = "",
    searchSchoolYear: string = ""
  ) {
    try {
      let dosenName: string | null = null;
      let prismaClient: typeof prisma | typeof prismaMysql;

      // Validasi role dan ambil nama dosen
      if (role === "dosen") {
        const existingDosen = await prisma.dosen.findUnique({
          where: { id: userId },
          select: { id: true, nama_depan: true },
        });
        if (!existingDosen) {
          throw new Error("Dosen not found in schema 1");
        }
        dosenName = existingDosen.nama_depan; // Nama dosen untuk filter
        prismaClient = prisma;
      } else if (role === "set_user_dosen") {
        const dosenSchema2 = await prismaMysql.set_user.findFirst({
          where: { id: userId },
          select: { id: true, nama: true }, // Asumsi ada kolom nama
        });
        if (!dosenSchema2) {
          throw new Error("Dosen not found in schema 2");
        }
        dosenName = dosenSchema2.nama; // Nama dosen untuk filter
        prismaClient = prismaMysql;
      } else {
        throw new Error(
          "Access denied: Role must be 'dosen' or 'set_user_dosen'"
        );
      }

      if (!dosenName) {
        throw new Error("Dosen name not found");
      }

      const skip = (page - 1) * limit;

      // Schema 1: Filter modul berdasarkan penanggung_jawab (nama dosen)
      const whereSchema1 = {
        AND: [
          { penanggung_jawab: dosenName }, // Filter berdasarkan nama dosen
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

      console.log("whereSchema1:", whereSchema1); // Debugging

      const totalModulSchema1 = await prisma.modul.count({
        where: whereSchema1,
      });

      const modulListSchema1 = await prisma.modul.findMany({
        where: whereSchema1,
        include: {
          peserta_moduls: true, // Untuk menghitung total_siswa
        },
        orderBy: {
          created_at: "desc",
        },
        skip,
        take: limit,
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

      // Schema 2: Filter ist_daftar_modul berdasarkan tim_modul (asumsi kolom)
      let modulsSchema2: any[] = [];
      let totalModulSchema2 = 0;

      let totalQueryString = `SELECT COUNT(*) as count FROM ist_daftar_modul`;
      let dataQueryString = `SELECT * FROM ist_daftar_modul`;
      const conditions: string[] = [];

      // Filter berdasarkan nama dosen (asumsi tim_modul berisi nama dosen)
      conditions.push(`tim_modul = '${dosenName}'`); // Sesuaikan dengan kolom yang benar

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

      dataQueryString += ` ORDER BY waktu_dibuat DESC LIMIT ${skip}, ${limit}`;

      console.log("dataQueryString:", dataQueryString); // Debugging

      // Eksekusi query total
      const totalQuery = await prismaMysql.$queryRawUnsafe<CountResult[]>(
        totalQueryString
      );
      totalModulSchema2 = Number(totalQuery[0].count) || 0;

      // Eksekusi query data
      if (totalModulSchema2 > 0) {
        modulsSchema2 = await prismaMysql.$queryRawUnsafe(dataQueryString);
      }

      const dataSchema2 = modulsSchema2.map((modul: any) => ({
        id: modul.id,
        nama_modul: modul.nama_modul || "N/A",
        tahun_ajaran: modul.tahun_akademik || "N/A",
        total_siswa: 0, // Perlu perhitungan tambahan jika ada relasi
        created_at: new Date(modul.waktu_dibuat),
      }));

      // Gabungkan data dari kedua schema
      const combinedData = [...dataSchema1, ...dataSchema2];
      combinedData.sort(
        (a, b) => b.created_at.getTime() - a.created_at.getTime()
      );

      const data = combinedData;
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

  static async getModulDosenDetailHasilPenilaian(
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
      let dosenName: string | null = null;
      let prismaClient: typeof prisma | typeof prismaMysql;

      // Validasi role dan ambil nama dosen
      if (role === "dosen") {
        const existingDosen = await prisma.dosen.findUnique({
          where: { id: userId },
          select: { id: true, nama_depan: true },
        });
        if (!existingDosen) {
          throw new Error("Dosen not found in schema 1");
        }
        dosenName = existingDosen.nama_depan;
        prismaClient = prisma;
      } else if (role === "set_user_dosen") {
        const dosenSchema2 = await prismaMysql.set_user.findFirst({
          where: { id: userId },
          select: { id: true, nama: true },
        });
        if (!dosenSchema2) {
          throw new Error("Dosen not found in schema 2");
        }
        dosenName = dosenSchema2.nama;
        prismaClient = prismaMysql;
      } else {
        throw new Error(
          "Access denied: Role must be 'dosen' or 'set_user_dosen'"
        );
      }

      if (!dosenName) {
        throw new Error("Dosen name not found");
      }

      const trimmedNamaModul = namaModul.trim();

      const modul = await prisma.modul.findFirst({
        where: { nama_modul: trimmedNamaModul },
      });

      if (!modul) {
        throw new Error(`Modul dengan nama "${trimmedNamaModul}" tidak ditemukan`);
      }

      console.log("Modul ID:", modul.id);

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

        console.log("PesertaModul ID:", pm.id);
        console.log("penilaianAkhirId:", pm.penilaian_akhir?.id);

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

          console.log("pm.penilaian_akhir:", pm.penilaian_akhir);
          console.log("pm.penilaian_praktikum:", pm.penilaian_praktikum);

          const nilaiAkhirSumatif = pm.penilaian_akhir
            ? Number(pm.penilaian_akhir?.nilai_sumatif?.toFixed(2))
            : 0;

          console.log("nilai akhir sumatig", nilaiAkhirSumatif);

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

          console.log("nilai akhir praktikum:", nilaiAkhirPraktikum);

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

export default DosenServices;
