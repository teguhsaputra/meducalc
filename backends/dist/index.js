"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const schema1_1 = __importDefault(require("./routes/schema1"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 8880;
const corsConfig = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
};
app.use((0, cors_1.default)(corsConfig));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/", schema1_1.default);
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
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
