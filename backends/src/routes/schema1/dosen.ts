import * as express from "express";
import PraktikumControllers from "../../controllers/schema1/praktikum";
import DosenControllers from "../../controllers/schema1/dosen";
import { authenticateUser } from "../../middlewares/admin-middleware";

const useDosenRoute = express.Router();

useDosenRoute.get("/ilmu-dosen", DosenControllers.getIlmuAndDosen);
useDosenRoute.get("/dosen-modul", authenticateUser, DosenControllers.getDosenModul)
useDosenRoute.get("/modul-by-dosen", authenticateUser, DosenControllers.getModulByDosen)
useDosenRoute.post("/admin/add-dosen", authenticateUser, DosenControllers.addDosen)


export default useDosenRoute;
