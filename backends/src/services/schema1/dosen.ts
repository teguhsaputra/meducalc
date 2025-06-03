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
}

export default DosenServices;
