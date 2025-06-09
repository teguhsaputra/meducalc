import * as express from "express";
import useAuthRouter from "./auth";
import useModulRoute from "./modul";
import useMahasiswaRoute from "./mahasiswa";
import usePraktikumRoute from "./praktikum";
import useDosenRoute from "./dosen";
import useKelompokRoute from "./kelompok";
import usePenilaianModulRoute from "./penilaian-modul";
import useSesiPenilaian from "./sesi-penilaian";

const route = express.Router();

route.use("/", useAuthRouter);
route.use("/", useModulRoute);
route.use("/", useMahasiswaRoute);
route.use("/", usePraktikumRoute);
route.use("/", useDosenRoute);
route.use("/", useKelompokRoute);
route.use("/", usePenilaianModulRoute);
route.use("/", useSesiPenilaian);
// route.use("/", usePemicuRoute);

export default route;
