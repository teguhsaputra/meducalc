"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mahasiswa_1 = __importDefault(require("../../services/schema1/mahasiswa"));
class MahasiswaControllers {
    static getMahasiswa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { page = 1, limit = 10, search = "" } = req.query;
                const result = yield mahasiswa_1.default.getMahasiswa(userId, role, Number(page), Number(limit), search);
                res.status(200).json({
                    status: true,
                    data: result,
                });
            }
            catch (error) {
                const err = error;
                res.status(400).json({ message: err.message, status: false });
            }
        });
    }
    static getAllMahasiswa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { page = 1, limit = 10, searchSiswa = "", searchNim = "", searchAngkatan = "", } = req.query;
                const result = yield mahasiswa_1.default.getAllMahasiswa(userId, role, Number(page), Number(limit), searchSiswa, searchNim, searchAngkatan);
                res.status(200).json({
                    status: true,
                    data: result,
                });
            }
            catch (error) {
                const err = error;
                res.status(400).json({ message: err.message, status: false });
            }
        });
    }
    static getMahasiswaDetailByNim(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { nim } = req.params;
                const result = yield mahasiswa_1.default.getDetailMahasiswaByNim(userId, role, nim);
                res.status(200).json({
                    status: true,
                    data: result,
                });
            }
            catch (error) {
                const err = error;
                res.status(400).json({ message: err.message, status: false });
            }
        });
    }
    static addMahasiswa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { namaDepan, namaBelakang, tanggalLahir, jenisKelamin, nim, angkatan, username, password, } = req.body;
                const result = yield mahasiswa_1.default.addMahasiswa(userId, role, namaDepan, namaBelakang, tanggalLahir, jenisKelamin, nim, angkatan, username, password);
                res.status(200).json({
                    status: true,
                    data: result,
                });
            }
            catch (error) {
                const err = error;
                res.status(500).json({ message: err.message, status: false });
            }
        });
    }
    static editMahasiswaById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { mahasiswaId } = req.params;
                const { namaDepan, namaBelakang, tanggalLahir, jenisKelamin, nim, angkatan, username, } = req.body;
                yield mahasiswa_1.default.editMahasiswaById(userId, role, Number(mahasiswaId), namaDepan, namaBelakang, tanggalLahir, jenisKelamin, nim, angkatan, username);
                res.status(200).json({
                    status: true,
                    message: "Akun berhasil diupdate",
                });
            }
            catch (error) {
                const err = error;
                res.status(500).json({ message: err.message, status: false });
            }
        });
    }
    static getMahasiswaById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { mahasiswaId } = req.params;
                const result = yield mahasiswa_1.default.getMahasiswaById(userId, role, Number(mahasiswaId));
                res.status(200).json({
                    status: true,
                    data: result,
                });
            }
            catch (error) {
                const err = error;
                res.status(400).json({ message: err.message, status: false });
            }
        });
    }
    static getModulByMahasiswa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { page = 1, limit = 10, searchSiswa = "", searchTahunAjaran = "", } = req.query;
                const result = yield mahasiswa_1.default.getModulMahasiswa(userId, role, Number(page), Number(limit), searchSiswa, searchTahunAjaran);
                res.status(200).json({
                    status: true,
                    data: result,
                });
            }
            catch (error) {
                const err = error;
                res.status(400).json({ message: err.message, status: false });
            }
        });
    }
    static getHasilPenilaianByNimMahasiswa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { namaModul, nim } = req.params;
                const data = yield mahasiswa_1.default.getHasilPenilaianByNimMahasiswa(userId, role, namaModul, nim);
                res.status(200).json({
                    status: true,
                    data,
                });
            }
            catch (error) {
                const err = error;
                res.status(400).json({ message: err.message, status: false });
            }
        });
    }
}
exports.default = MahasiswaControllers;
