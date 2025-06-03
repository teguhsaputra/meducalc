import prisma from "../../lib/db1";
import prismaMysql from "../../lib/db2";

class PraktikumServices {
  static async getPraktikum() {
    try {
      const praktikums = await prisma.praktikum.findMany();

      return praktikums;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
  static async getPraktikumByModul(
    userId: number,
    role: string,
    modul_id: number
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

      const praktikumRelations = await prisma.modulPraktikum.findMany({
        where: { modul_id },
        select: { praktikum_id: true },
      });

      const praktikumIds = praktikumRelations.map(
        (relation) => relation.praktikum_id
      );

      const praktikums = await prisma.praktikum.findMany({
        where: { id: { in: praktikumIds } },
      });

      return praktikums;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  static async getJenisPenilaian() {
    try {
      const jenisPenilaian = await prismaMysql.mda_jenis_penilaian.findMany({
        select: {
          id: true,
          jenis_penilaian: true
        }
      });

      return jenisPenilaian;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export default PraktikumServices;
