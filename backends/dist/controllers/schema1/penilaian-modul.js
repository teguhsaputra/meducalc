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
const penilaian_modul_1 = __importDefault(require("../../services/schema1/penilaian-modul"));
class PenilaianModulControllers {
    static getModulByDosen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { page = 1, limit = 10, searchModul, searchSchoolYear } = req.query;
                const data = yield penilaian_modul_1.default.getModulForInputPenilaian(userId, role, Number(page), Number(limit), searchModul, searchSchoolYear);
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
    static getModulDetailForInputPenilaian(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { namaModul } = req.params;
                const { page = 1, limit = 10, searchSiswa, searchNim, searchAngkatan, } = req.query;
                const data = yield penilaian_modul_1.default.getModulDetailForInputPenilaian(userId, role, namaModul, Number(page), Number(limit), searchSiswa, searchNim, searchAngkatan);
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
    static getModulByNim(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { namaModul, nim } = req.params;
                const data = yield penilaian_modul_1.default.getModulByNim(userId, role, namaModul, nim);
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
    static inputPenilaian(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { nim, namaModul } = req.params;
                const { input } = req.body;
                yield penilaian_modul_1.default.InputPenilaian(userId, role, nim, namaModul, input);
                res.status(200).json({
                    status: true,
                    message: "Berhasil di simpan",
                });
            }
            catch (error) {
                const err = error;
                res.status(400).json({ message: err.message, status: false });
            }
        });
    }
    static getHasilInputPenilaian(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { namaModul, nim } = req.params;
                const data = yield penilaian_modul_1.default.getHasilInputPenilaian(userId, role, namaModul, nim);
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
    static getModulDetailHasilPenilaian(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { namaModul } = req.params;
                const { page = 1, limit = 10, searchSiswa, searchNim, sortOrder = "asc", tingkatFilter = "", } = req.query;
                const data = yield penilaian_modul_1.default.getModulDetailHasilPenilaian(userId, role, namaModul, Number(page), Number(limit), searchSiswa, searchNim, sortOrder, tingkatFilter);
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
exports.default = PenilaianModulControllers;
