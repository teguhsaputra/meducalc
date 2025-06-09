"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const dosen_1 = __importDefault(require("../../controllers/schema1/dosen"));
const admin_middleware_1 = require("../../middlewares/admin-middleware");
const useDosenRoute = express.Router();
// admin
useDosenRoute.get("/ilmu-dosen", dosen_1.default.getIlmuAndDosen);
useDosenRoute.get("/dosen-modul", admin_middleware_1.authenticateUser, dosen_1.default.getDosenModul);
useDosenRoute.get("/modul-by-dosen", admin_middleware_1.authenticateUser, dosen_1.default.getModulByDosen);
useDosenRoute.post("/admin/add-dosen", admin_middleware_1.authenticateUser, dosen_1.default.addDosen);
// dosen
useDosenRoute.get("/dosen/modul", admin_middleware_1.authenticateUser, dosen_1.default.getModulDosen);
useDosenRoute.get("/dosen/hasil/modul/:namaModul", admin_middleware_1.authenticateUser, dosen_1.default.getModulDosenDetailHasilPenilaian);
useDosenRoute.get("/dosen/hasil/modul/peserta/:namaModul/:nim", admin_middleware_1.authenticateUser, dosen_1.default.getModulDosenHasilInputPenilaian);
useDosenRoute.get("/dosen/penilaian/modul/:namaModul", admin_middleware_1.authenticateUser, dosen_1.default.getModulDosenDetailForInputPenilaian);
useDosenRoute.get("/dosen/penilaian/modul/peserta/:namaModul/:nim", admin_middleware_1.authenticateUser, dosen_1.default.getModulDosenByNimPeserta);
useDosenRoute.post("/dosen/penilaian/modul/peserta/:namaModul/:nim", admin_middleware_1.authenticateUser, dosen_1.default.modulDosenInputPenilaian);
exports.default = useDosenRoute;
