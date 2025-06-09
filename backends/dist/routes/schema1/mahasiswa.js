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
const mahasiswa_1 = __importDefault(require("../../controllers/schema1/mahasiswa"));
const admin_middleware_1 = require("../../middlewares/admin-middleware");
const useMahasiswaRoute = express.Router();
useMahasiswaRoute.get("/mahasiswa/detail/:mahasiswaId", admin_middleware_1.authenticateUser, mahasiswa_1.default.getMahasiswaById);
useMahasiswaRoute.get("/mahasiswa", admin_middleware_1.authenticateUser, mahasiswa_1.default.getMahasiswa);
useMahasiswaRoute.get("/mahasiswa", admin_middleware_1.authenticateUser, mahasiswa_1.default.getAllMahasiswa);
useMahasiswaRoute.get("/mahasiswa/:nim", admin_middleware_1.authenticateUser, mahasiswa_1.default.getMahasiswaDetailByNim);
useMahasiswaRoute.post("/mahasiswa/add", admin_middleware_1.authenticateUser, mahasiswa_1.default.addMahasiswa);
useMahasiswaRoute.put("/mahasiswa/edit/:mahasiswaId", admin_middleware_1.authenticateUser, mahasiswa_1.default.editMahasiswaById);
//
useMahasiswaRoute.get("/user/mahasiswa", admin_middleware_1.authenticateUser, mahasiswa_1.default.getModulByMahasiswa);
useMahasiswaRoute.get("/user/mahasiswa/:namaModul/:nim", admin_middleware_1.authenticateUser, mahasiswa_1.default.getHasilPenilaianByNimMahasiswa);
exports.default = useMahasiswaRoute;
