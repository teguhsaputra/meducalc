import * as express from "express";
import AuthController from "../../controllers/schema1/auth";
import ModulControllers from "../../controllers/schema1/modul";
import { authenticateUser } from "../../middlewares/admin-middleware";

const useModulRoute = express.Router();

// useModulRoute.post("/auth/login/admin", AuthController.login);
useModulRoute.get("/modul/admin", authenticateUser, ModulControllers.getModul);
useModulRoute.get("/modul/admin/:modul_id", authenticateUser, ModulControllers.getModulById);
useModulRoute.post("/modul/admin/add", authenticateUser, ModulControllers.addModul);
useModulRoute.delete("/modul/admin/delete/:modulId", authenticateUser, ModulControllers.deleteModul);
useModulRoute.put("/modul/admin/edit/:modulId", authenticateUser, ModulControllers.updateModul);

// pemicu

useModulRoute.post("/modul/admin/add-pemicu", authenticateUser, ModulControllers.addPemicu);

// penilaian modul
useModulRoute.post("/modul/admin/add-penilaian", authenticateUser, ModulControllers.addPenilaianModul);

// peserta
useModulRoute.post("/modul/admin/add-peserta", authenticateUser, ModulControllers.addPeserta);

// kelompok
useModulRoute.post("/modul/admin/kelompok/add", authenticateUser, ModulControllers.createKelompok);
useModulRoute.post("/modul/admin/kelompok/delete", authenticateUser, ModulControllers.deleteKelompok);
useModulRoute.post("/modul/admin/kelompok/add-peserta", authenticateUser, ModulControllers.addPesertaToKelompok);
useModulRoute.post("/modul/admin/kelompok/delete-peserta", authenticateUser, ModulControllers.deletePesertaFromKelompok);

//dosen
useModulRoute.get("/modul/admin/dosen/all-dosen", authenticateUser, ModulControllers.getDosenPenanggungJawab);




export default useModulRoute;
