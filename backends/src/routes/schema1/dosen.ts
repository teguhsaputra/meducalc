import * as express from "express";
import PraktikumControllers from "../../controllers/schema1/praktikum";
import DosenControllers from "../../controllers/schema1/dosen";
import { authenticateUser } from "../../middlewares/admin-middleware";

const useDosenRoute = express.Router();

// admin
useDosenRoute.get("/ilmu-dosen", DosenControllers.getIlmuAndDosen);
useDosenRoute.get("/dosen-modul", authenticateUser, DosenControllers.getDosenModul)
useDosenRoute.get("/modul-by-dosen", authenticateUser, DosenControllers.getModulByDosen)
useDosenRoute.post("/admin/add-dosen", authenticateUser, DosenControllers.addDosen)

// dosen
useDosenRoute.get("/dosen/modul", authenticateUser, DosenControllers.getModulDosen)
useDosenRoute.get("/dosen/hasil/modul/:namaModul", authenticateUser, DosenControllers.getModulDosenDetailHasilPenilaian)
useDosenRoute.get("/dosen/hasil/modul/peserta/:namaModul/:nim", authenticateUser, DosenControllers.getModulDosenHasilInputPenilaian)
useDosenRoute.get("/dosen/penilaian/modul/:namaModul", authenticateUser, DosenControllers.getModulDosenDetailForInputPenilaian)
useDosenRoute.get("/dosen/penilaian/modul/peserta/:namaModul/:nim", authenticateUser, DosenControllers.getModulDosenByNimPeserta)
useDosenRoute.post("/dosen/penilaian/modul/peserta/:namaModul/:nim", authenticateUser, DosenControllers.modulDosenInputPenilaian)




export default useDosenRoute;
