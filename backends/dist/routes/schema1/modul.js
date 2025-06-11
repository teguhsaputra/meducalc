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
const modul_1 = __importDefault(require("../../controllers/schema1/modul"));
const admin_middleware_1 = require("../../middlewares/admin-middleware");
const useModulRoute = express.Router();
// useModulRoute.post("/auth/login/admin", AuthController.login);
useModulRoute.get("/modul/admin", admin_middleware_1.authenticateUser, modul_1.default.getModul);
useModulRoute.get("/modul/admin/:modul_id", admin_middleware_1.authenticateUser, modul_1.default.getModulById);
useModulRoute.post("/modul/admin/add", admin_middleware_1.authenticateUser, modul_1.default.addModul);
useModulRoute.delete("/modul/admin/delete/:modulId", admin_middleware_1.authenticateUser, modul_1.default.deleteModul);
// pemicu
useModulRoute.post("/modul/admin/add-pemicu", admin_middleware_1.authenticateUser, modul_1.default.addPemicu);
// penilaian modul
useModulRoute.post("/modul/admin/add-penilaian", admin_middleware_1.authenticateUser, modul_1.default.addPenilaianModul);
// peserta
useModulRoute.post("/modul/admin/add-peserta", admin_middleware_1.authenticateUser, modul_1.default.addPeserta);
// kelompok
useModulRoute.post("/modul/admin/kelompok/add", admin_middleware_1.authenticateUser, modul_1.default.createKelompok);
useModulRoute.post("/modul/admin/kelompok/delete", admin_middleware_1.authenticateUser, modul_1.default.deleteKelompok);
useModulRoute.post("/modul/admin/kelompok/add-peserta", admin_middleware_1.authenticateUser, modul_1.default.addPesertaToKelompok);
useModulRoute.post("/modul/admin/kelompok/delete-peserta", admin_middleware_1.authenticateUser, modul_1.default.deletePesertaFromKelompok);
exports.default = useModulRoute;
