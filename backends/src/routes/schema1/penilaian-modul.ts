import * as express from "express";
import { authenticateUser } from "../../middlewares/admin-middleware";
import PenilaianModulControllers from "../../controllers/schema1/penilaian-modul";

const usePenilaianModulRoute = express.Router();

usePenilaianModulRoute.get("/penilaian/modul", authenticateUser,PenilaianModulControllers.getModulByDosen);
usePenilaianModulRoute.get("/penilaian/modul/:namaModul", authenticateUser, PenilaianModulControllers.getModulDetailForInputPenilaian)
usePenilaianModulRoute.get("/penilaian/modul/peserta/:namaModul/:nim", authenticateUser, PenilaianModulControllers.getModulByNim)
usePenilaianModulRoute.post("/penilaian/modul/peserta/:namaModul/:nim", authenticateUser, PenilaianModulControllers.inputPenilaian)

//hasil penilaian
usePenilaianModulRoute.get("/hasil/modul/peserta/:namaModul/:nim", authenticateUser, PenilaianModulControllers.getHasilInputPenilaian)
usePenilaianModulRoute.get("/hasil/modul/:namaModul", authenticateUser, PenilaianModulControllers.getModulDetailHasilPenilaian)


export default usePenilaianModulRoute;
