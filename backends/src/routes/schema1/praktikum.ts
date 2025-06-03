import * as express from "express";
import MahasiswaControllers from "../../controllers/schema1/mahasiswa";
import PraktikumControllers from "../../controllers/schema1/praktikum";
import { authenticateUser } from "../../middlewares/admin-middleware";

const usePraktikumRoute = express.Router();

usePraktikumRoute.get("/praktikums", PraktikumControllers.getPraktikum);
usePraktikumRoute.get(
  "/praktikum",
  authenticateUser,
  PraktikumControllers.getPraktikumByModul
);

// jenis penilaian
usePraktikumRoute.get("/jenis-penilaian", PraktikumControllers.getJenisPenilaian);


export default usePraktikumRoute;
