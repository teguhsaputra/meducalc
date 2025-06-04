import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import route from "./routes/schema1";

dotenv.config();

const app: Express = express();
const port = 8081;
const corsConfig: object = {
  origin: [
    "http://localhost:3005",
    "https://meducalc.rftdigitalsolution.com",
    "http://localhost:3000",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/", route);

// app.get("/api/mahasiswa", async (req: Request, res: Response) => {
//   try {
//     // Ambil data dan cast tgl_lahir jadi string pakai MySQL function
//     const result = await prismaMysql.$queryRawUnsafe<any[]>(`
//       SELECT
//         id,
//         angkatan,
//         nim,
//         nama_mahasiswa,
//         tempat_lahir,
//         CAST(tgl_lahir AS CHAR) AS tgl_lahir,
//         alamat,
//         hp,
//         email,
//         waktu_dibuat,
//         waktu_dirubah,
//         dibuat_oleh,
//         dirubah_oleh,
//         riwayat_perubahan
//       FROM mda_master_mahasiswa
//     `);

//     const mahasiswa = result.map((item) => {
//       let tgl_lahir_iso: string | null = null;

//       if (item.tgl_lahir && item.tgl_lahir !== "0000-00-00") {
//         const date = new Date(item.tgl_lahir);
//         if (!isNaN(date.getTime())) {
//           tgl_lahir_iso = date.toISOString();
//         }
//       }

//       return {
//         ...item,
//         tgl_lahir: tgl_lahir_iso,
//       };
//     });

//     res.status(200).json({
//       success: true,
//       data: mahasiswa,
//     });
//   } catch (error) {
//     const err = error as Error;
//     res.status(500).json({ message: err.message, status: false });
//   }
// });

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${port}`);
});
