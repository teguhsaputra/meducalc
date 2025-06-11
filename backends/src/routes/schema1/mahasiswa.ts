import * as express from "express";
import MahasiswaControllers from "../../controllers/schema1/mahasiswa";
import { authenticateUser } from "../../middlewares/admin-middleware";

const useMahasiswaRoute = express.Router();

useMahasiswaRoute.get(
  "/mahasiswa/detail/:mahasiswaId",
  authenticateUser,
  MahasiswaControllers.getMahasiswaById
);
useMahasiswaRoute.get(
  "/mahasiswa",
  authenticateUser,
  MahasiswaControllers.getMahasiswa
);
useMahasiswaRoute.get(
  "/all-mahasiswa",
  authenticateUser,
  MahasiswaControllers.getAllMahasiswa
);
useMahasiswaRoute.get(
  "/mahasiswa/:nim",
  authenticateUser,
  MahasiswaControllers.getMahasiswaDetailByNim
);
useMahasiswaRoute.post(
  "/mahasiswa/add",
  authenticateUser,
  MahasiswaControllers.addMahasiswa
);
useMahasiswaRoute.put(
  "/mahasiswa/edit/:mahasiswaId",
  authenticateUser,
  MahasiswaControllers.editMahasiswaById
);

//
useMahasiswaRoute.get(
  "/user/mahasiswa",
  authenticateUser,
  MahasiswaControllers.getModulByMahasiswa
);
useMahasiswaRoute.get(
  "/user/mahasiswa/:namaModul/:nim",
  authenticateUser,
  MahasiswaControllers.getHasilPenilaianByNimMahasiswa
);

export default useMahasiswaRoute;
