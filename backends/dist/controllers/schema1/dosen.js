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
const dosen_1 = __importDefault(require("../../services/schema1/dosen"));
class DosenControllers {
    static getIlmuAndDosen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield dosen_1.default.getIlmuAndDosen();
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
    static getDosenModul(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { page = 1, pageSize = 10, search = "" } = req.query;
                const data = yield dosen_1.default.getDosenModul(userId, role, Number(page), Number(pageSize), search);
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
    static getModulByDosen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { page = 1, limit = 10, search = "", penanggungJawab, searchModul, searchSchoolYear, } = req.query;
                const data = yield dosen_1.default.getModulByDosen(userId, role, Number(page), Number(limit), searchModul, searchSchoolYear, penanggungJawab);
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
    static addDosen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { namaDepan, tanggalLahir, username, password } = req.body;
                const data = yield dosen_1.default.addDosen(userId, role, namaDepan, tanggalLahir, username, password);
                res.status(201).json({
                    status: true,
                    data,
                });
            }
            catch (error) {
                const err = error;
                res.status(500).json({ message: err.message, status: false });
            }
        });
    }
    static getModulDosen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { page = 1, limit = 10, searchModul, searchSchoolYear } = req.query;
                const data = yield dosen_1.default.getModulDosen(userId, role, Number(page), Number(limit), searchModul, searchSchoolYear);
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
    static getModulDosenDetailHasilPenilaian(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { namaModul } = req.params;
                const { page = 1, limit = 10, searchSiswa, searchNim, sortOrder = "asc", tingkatFilter = "", } = req.query;
                const data = yield dosen_1.default.getModulDosenDetailHasilPenilaian(userId, role, namaModul, Number(page), Number(limit), searchSiswa, searchNim, sortOrder, tingkatFilter);
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
exports.default = DosenControllers;
