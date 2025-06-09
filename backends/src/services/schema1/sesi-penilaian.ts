import prisma from "../../lib/db1";
import prismaMysql from "../../lib/db2";

class SesiPenilaianServices {
  static async sesiPenilaian(
    userId: number,
    role: string,
    action: "activate" | "deactivate" | "check",
    sesiMulai?: string,
    sesiSelesai?: string
  ) {
    try {
      // Hapus variabel yang tidak digunakan
      // let dosenName: string | null = null;
      // let prismaClient: typeof prisma | typeof prismaMysql;

      if (role === "admin") {
        const existingAdmin = await prisma.admin.findUnique({
          where: { id: userId },
        });
        if (!existingAdmin) {
          throw new Error("Admin not found");
        }
      } else if (role === "dosen") {
        const existingDosen = await prisma.dosen.findUnique({
          where: { id: userId },
          select: { id: true, nama_depan: true },
        });
        if (!existingDosen) {
          throw new Error("Dosen not found in schema 1");
        }
      } else if (role === "set_user_dosen") {
        const dosenSchema2 = await prismaMysql.set_user.findFirst({
          where: { id: userId },
          select: { id: true, nama: true },
        });
        if (!dosenSchema2) {
          throw new Error("Dosen not found in schema 2");
        }
      } else {
        throw new Error(
          "Access denied: Role must be 'admin', 'dosen', or 'set_user_dosen'"
        );
      }

      if (action === "activate") {
        if (!sesiMulai || !sesiSelesai) {
          throw new Error(
            "sesiMulai and sesiSelesai are required to activate a session"
          );
        }

        const mulai = new Date(sesiMulai);
        const selesai = new Date(sesiSelesai);

        // Validasi tambahan untuk memastikan zona waktu
        if (isNaN(mulai.getTime()) || isNaN(selesai.getTime())) {
          throw new Error(
            "Invalid date format for sesiMulai or sesiSelesai. Use ISO format (e.g., '2025-06-05T16:12:00Z')"
          );
        }

        if (mulai >= selesai) {
          throw new Error("sesiMulai must be earlier than sesiSelesai");
        }

        // Debugging
        console.log("Debug - sesiMulai input:", sesiMulai);
        console.log("Debug - sesiSelesai input:", sesiSelesai);
        console.log("Debug - mulai after conversion:", mulai.toISOString());
        console.log("Debug - selesai after conversion:", selesai.toISOString());

        const existingActiveSession = await prisma.sesiPenilaian.findFirst({
          where: {
            modul_id: null,
            status: "Aktif",
          },
        });

        if (existingActiveSession) {
          throw new Error(
            `There is already an active global session. Please deactivate it first.`
          );
        }

        const newSession = await prisma.sesiPenilaian.create({
          data: {
            sesi_mulai: mulai,
            sesi_selesai: selesai,
            modul_id: null,
            status: "Aktif",
          },
        });

        return {
          message: `Sesi penilaian global telah diaktifkan (mulai: ${mulai.toLocaleString(
            "id-ID",
            { timeZone: "Asia/Jakarta" }
          )} - selesai: ${selesai.toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
          })})`,
          data: newSession,
        };
      } else if (action === "deactivate") {
        const activeSession = await prisma.sesiPenilaian.findFirst({
          where: {
            modul_id: null,
            status: "Aktif",
          },
        });

        if (!activeSession) {
          throw new Error(`No active global session found`);
        }

        const updatedSession = await prisma.sesiPenilaian.update({
          where: { id: activeSession.id },
          data: {
            status: "Tidak Aktif",
            sesi_selesai: new Date(),
          },
        });

        return {
          message: `Sesi penilaian global telah dinonaktifkan`,
          data: updatedSession,
        };
      } else if (action === "check") {
        const activeSession = await prisma.sesiPenilaian.findFirst({
          where: {
            modul_id: null,
            status: "Aktif",
          },
        });

        if (!activeSession) {
          return {
            message: `No active global session`,
            isActive: false,
          };
        }

        const now = new Date();
        const mulai = new Date(activeSession.sesi_mulai);
        const selesai = new Date(activeSession.sesi_selesai);

        if (now < mulai) {
          return {
            message: `Sesi penilaian global belum dimulai (mulai pada ${mulai.toLocaleString(
              "id-ID",
              { timeZone: "Asia/Jakarta" }
            )})`,
            isActive: false,
          };
        }
        if (now > selesai) {
          const updatedSession = await prisma.sesiPenilaian.update({
            where: { id: activeSession.id },
            data: {
              status: "Tidak Aktif",
            },
          });

          return {
            message: `Sesi penilaian global telah berakhir (selesai pada ${selesai.toLocaleString(
              "id-ID",
              { timeZone: "Asia/Jakarta" }
            )})`,
            isActive: false,
            data: updatedSession,
          };
        }

        return {
          message: `Sesi penilaian global sedang aktif (mulai: ${mulai.toLocaleString(
            "id-ID",
            { timeZone: "Asia/Jakarta" }
          )} - selesai: ${selesai.toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
          })})`,
          isActive: true,
          data: activeSession,
        };
      } else {
        throw new Error(
          "Invalid action. Use 'activate', 'deactivate', or 'check'"
        );
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  static async getSesiPenilaian(userId: number, role: string) {
    try {
      // Validasi role
      if (!["admin", "dosen"].includes(role)) {
        throw new Error("Access denied: Role must be 'admin' or 'dosen'");
      }

      if (role === "admin") {
        const existingAdmin = await prisma.admin.findUnique({
          where: { id: userId },
        });
        if (!existingAdmin) {
          throw new Error("Admin not found");
        }
      } else if (role === "dosen") {
        const existingDosen = await prisma.dosen.findUnique({
          where: { id: userId },
        });
        if (!existingDosen) {
          throw new Error("Dosen not found");
        }
      }

      const latestSession = await prisma.sesiPenilaian.findFirst({
        where: {
          modul_id: null, // Sesi global
        },
        orderBy: {
          created_at: "desc", // Ambil yang terbaru
        },
      });

      if (!latestSession) {
        throw new Error("Belum ada sesi penilaian global yang dibuat");
      }

      const now = new Date();
      const mulai = new Date(latestSession.sesi_mulai);
      const selesai = new Date(latestSession.sesi_selesai);

      let status: "Aktif" | "Belum Dimulai" | "Selesai" | "Tidak Aktif";
      let isActive = false;
      let message: string;

      if (latestSession.status === "Tidak Aktif") {
        status = "Tidak Aktif";
        message = `Sesi penilaian global telah dinonaktifkan`;
      } else if (now < mulai) {
        status = "Belum Dimulai";
        message = `Sesi penilaian global belum dimulai (mulai pada ${mulai.toLocaleString(
          "id-ID",
          { timeZone: "Asia/Jakarta" }
        )})`;
      } else if (now > selesai) {
        status = "Selesai";
        message = `Sesi penilaian global telah berakhir (selesai pada ${selesai.toLocaleString(
          "id-ID",
          { timeZone: "Asia/Jakarta" }
        )})`;

        await prisma.sesiPenilaian.update({
          where: { id: latestSession.id },
          data: {
            status: "Tidak Aktif",
          },
        });
      } else {
        status = "Aktif";
        isActive = true;
        message = `Sesi penilaian global sedang aktif (mulai: ${mulai.toLocaleString(
          "id-ID",
          { timeZone: "Asia/Jakarta" }
        )} - selesai: ${selesai.toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
        })})`;
      }

      return {
        message,
        status,
        sesiMulai: mulai.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
        sesiSelesai: selesai.toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
        }),
        isActive,
        data: {
          id: latestSession.id,
          sesi_mulai: latestSession.sesi_mulai,
          sesi_selesai: latestSession.sesi_selesai,
          status: latestSession.status,
          created_at: latestSession.created_at,
          updated_at: latestSession.updated_at,
        },
      };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export default SesiPenilaianServices;
