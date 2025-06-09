import * as express from "express";
import MahasiswaControllers from "../../controllers/schema1/mahasiswa";
import PraktikumControllers from "../../controllers/schema1/praktikum";
import { authenticateUser } from "../../middlewares/admin-middleware";
import SesiPenilaianControllers from "../../controllers/schema1/sesi-penilaian";

const useSesiPenilaian = express.Router();

useSesiPenilaian.post(
  "/admin/sesi-penilaian",
  authenticateUser,
  SesiPenilaianControllers.sesiPenilaian
);
useSesiPenilaian.get(
  "/admin/get-sesi-penilaian",
  authenticateUser,
  SesiPenilaianControllers.getSesiPenilaian
);

export default useSesiPenilaian;
