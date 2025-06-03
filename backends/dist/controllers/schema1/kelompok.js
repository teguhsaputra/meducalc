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
const kelompok_1 = __importDefault(require("../../services/schema1/kelompok"));
class KelompokControllers {
    static getKelompokByModul(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { modul_id } = req.query;
                const kelompoks = yield kelompok_1.default.getKelompokByModul(userId, role, Number(modul_id));
                res.status(200).json({
                    status: true,
                    data: kelompoks,
                });
            }
            catch (error) {
                const err = error;
                res.status(400).json({ message: err.message, status: false });
            }
        });
    }
    static getPesertaByModul(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { modul_id } = req.query;
                const peserta = yield kelompok_1.default.getPesertaByModul(userId, role, Number(modul_id));
                res.status(200).json({
                    status: true,
                    data: peserta,
                });
            }
            catch (error) {
                const err = error;
                res.status(400).json({ message: err.message, status: false });
            }
        });
    }
    static getKelompokAnggota(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { modul_id } = req.query;
                const peserta = yield kelompok_1.default.getKelompokAnggota(userId, role, Number(modul_id));
                res.status(200).json({
                    status: true,
                    data: peserta,
                });
            }
            catch (error) {
                const err = error;
                res.status(400).json({ message: err.message, status: false });
            }
        });
    }
}
exports.default = KelompokControllers;
