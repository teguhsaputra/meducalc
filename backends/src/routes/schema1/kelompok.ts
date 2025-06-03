import * as express from "express";
import { authenticateUser } from "../../middlewares/admin-middleware";
import KelompokControllers from "../../controllers/schema1/kelompok";

const useKelompokRoute = express.Router();

useKelompokRoute.get(
  "/kelompok",
  authenticateUser,
  KelompokControllers.getKelompokByModul
);

useKelompokRoute.get(
  "/peserta",
  authenticateUser,
  KelompokControllers.getPesertaByModul
);

useKelompokRoute.get(
  "/peserta-kelompok",
  authenticateUser,
  KelompokControllers.getKelompokAnggota
);

export default useKelompokRoute;
