import prisma from "../../lib/db1";
import prismaMysql from "../../lib/db2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthServices {
  static async login(username: string, password: string) {
    try {
      const [admin, mahasiswaSchema1, dosenSchema1, userSchema2] =
        await Promise.all([
          prisma.admin.findUnique({
            where: { username },
          }),
          prisma.mahasiswa.findUnique({
            where: { username },
          }),
          prisma.dosen.findUnique({
            where: { username },
          }),
          prismaMysql.set_user.findFirst({
            where: { username },
          }),
        ]);

      let user: any = null;
      let role: string = "";

      if (admin) {
        user = admin;
        role = "admin";
      } else if (mahasiswaSchema1) {
        user = mahasiswaSchema1;
        role = "mahasiswa";
      } else if (dosenSchema1) {
        user = dosenSchema1;
        role = "dosen";
      } else if (userSchema2) {
        user = userSchema2;
        if (userSchema2.tingkat_user === "mahasiswa") {
          role = "set_user_mahasiswa";
        } else if (userSchema2.tingkat_user === "dosen") {
          role = "set_user_dosen";
        } else {
          throw new Error("Tipe pengguna tidak valid di set_user");
        }
      } else {
        throw new Error("Username tidak ditemukan");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Password tidak valid");
      }

      const accessToken = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: role,
        },
        process.env.SECRET_KEY!,
        { expiresIn: "1d" }
      );

      return {
        accessToken,
        role,
      };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  static async getMe(userId: number, role: string) {
    try {
      let data: any = null;

      if (role === "admin") {
        data = await prisma.admin.findUnique({
          where: { id: userId },
          select: {
            id: true,
            username: true,
            created_at: true,
            updated_at: true,
          },
        });
      } else if (role === "mahasiswa") {
        data = await prisma.mahasiswa.findUnique({
          where: { id: userId },
          select: {
            id: true,
            username: true,
            nama_depan: true,
            nama_belakang: true,
            nim: true,
            created_at: true,
            updated_at: true,
          },
        });
      } else if (role === "dosen") {
        data = await prisma.dosen.findUnique({
          where: { id: userId },
          select: {
            id: true,
            username: true,
            created_at: true,
            updated_at: true,
          },
        });
      } else if (role === "set_user_mahasiswa" || role === "set_user_dosen") {
        data = await prismaMysql.set_user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            username: true,
            tingkat_user: true,
            nama: true,
          },
        });

        if (
          (role === "set_user_mahasiswa" && data?.user_type !== "mahasiswa") ||
          (role === "set_user_dosen" && data?.user_type !== "dosen")
        ) {
          throw new Error("Tipe pengguna tidak sesuai dengan data");
        }
      } else {
        throw new Error("Role pengguna tidak valid");
      }

      if (!data) {
        throw new Error("User not found");
      }

      return { data, role };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export default AuthServices;
