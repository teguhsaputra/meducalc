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
const modul_1 = __importDefault(require("../../services/schema1/modul"));
class ModulControllers {
    static getModul(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { page = 1, limit = 10, search = "" } = req.query;
                const data = yield modul_1.default.getModul(Number(page), Number(limit), search, userId, role);
                res.status(200).json({
                    success: true,
                    data,
                });
            }
            catch (error) {
                const err = error;
                res.status(500).json({ message: err.message, status: false });
            }
        });
    }
    static addModul(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { nama_modul, tahun_mulai, tahun_selesai, penanggung_jawab, bobot_nilai_akhir, bobot_nilai_proses, praktikum_id, } = req.body;
                const newModul = yield modul_1.default.createModul(nama_modul, tahun_mulai, tahun_selesai, penanggung_jawab, bobot_nilai_akhir, bobot_nilai_proses, praktikum_id, userId, role);
                res.status(200).json({
                    success: true,
                    data: newModul,
                });
            }
            catch (error) {
                const err = error;
                res.status(500).json({ message: err.message, status: false });
            }
        });
    }
    static addPemicu(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { modul_id, pemicus } = req.body;
                const newPemicu = yield modul_1.default.addPemicu(userId, role, modul_id, pemicus);
                res.status(200).json({
                    success: true,
                    data: newPemicu,
                });
            }
            catch (error) {
                const err = error;
                res.status(500).json({ message: err.message, status: false });
            }
        });
    }
    static addPenilaianModul(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { modul_id, total_soal_sum1, total_soal_sum2, total_soal_her_sum1, total_soal_her_sum2, penilaianProses, } = req.body;
                const newPemicu = yield modul_1.default.addPenilaianModul(userId, role, modul_id, total_soal_sum1, total_soal_sum2, total_soal_her_sum1, total_soal_her_sum2, penilaianProses);
                res.status(200).json({
                    success: true,
                    data: newPemicu,
                });
            }
            catch (error) {
                const err = error;
                res.status(500).json({ message: err.message, status: false });
            }
        });
    }
    static addPeserta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { modul_id, mahasiswaId } = req.body;
                yield modul_1.default.addPeserta(userId, role, modul_id, mahasiswaId);
                res.status(201).json({
                    success: true,
                    message: `Tambah peserta di modul id ${modul_id} berhasil`,
                });
            }
            catch (error) {
                const err = error;
                res.status(400).json({ message: err.message, status: false });
            }
        });
    }
    static createKelompok(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { modul_id } = req.body;
                yield modul_1.default.createKelompok(userId, role, modul_id);
                res.status(201).json({
                    success: true,
                    message: `Kelompok berhasil dibuat`,
                });
            }
            catch (error) {
                const err = error;
                res.status(500).json({ message: err.message, status: false });
            }
        });
    }
    static deleteKelompok(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { modul_id, kelompokId } = req.body;
                yield modul_1.default.deleteKelompok(userId, role, modul_id, kelompokId);
                res.status(200).json({
                    success: true,
                    message: `Kelompok berhasil dihapus`,
                });
            }
            catch (error) {
                const err = error;
                res.status(400).json({ message: err.message, status: false });
            }
        });
    }
    static addPesertaToKelompok(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { modul_id, kelompokId, nims } = req.body;
                yield modul_1.default.addPesertaToKelompok(userId, role, modul_id, kelompokId, nims);
                res.status(200).json({
                    success: true,
                    message: `Peserta Id ${nims} berhasil ditambah ke kelompok ${kelompokId}`,
                });
            }
            catch (error) {
                const err = error;
                res.status(400).json({ message: err.message, status: false });
            }
        });
    }
    static deletePesertaFromKelompok(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { kelompokAnggotaId } = req.body;
                yield modul_1.default.deletePesertaFromKelompok(userId, role, kelompokAnggotaId);
                res.status(200).json({
                    success: true,
                    message: `Peserta Kelompok berhasil dihapus`,
                });
            }
            catch (error) {
                const err = error;
                res.status(400).json({ message: err.message, status: false });
            }
        });
    }
    static getModulById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { modul_id } = req.params;
                const result = yield modul_1.default.getModulById(userId, role, Number(modul_id));
                res.status(200).json({
                    success: true,
                    data: result,
                });
            }
            catch (error) {
                const err = error;
                res.status(400).json({ message: err.message, status: false });
            }
        });
    }
}
exports.default = ModulControllers;
