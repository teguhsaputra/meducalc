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
const praktikum_1 = __importDefault(require("../../services/schema1/praktikum"));
class PraktikumControllers {
    static getPraktikum(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const praktikums = yield praktikum_1.default.getPraktikum();
                res.status(200).json({
                    status: true,
                    data: praktikums,
                });
            }
            catch (error) {
                const err = error;
                res.status(400).json({ message: err.message, status: false });
            }
        });
    }
    static getPraktikumByModul(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const { modul_id } = req.query;
                const praktikums = yield praktikum_1.default.getPraktikumByModul(userId, role, Number(modul_id));
                res.status(200).json({
                    status: true,
                    data: praktikums,
                });
            }
            catch (error) {
                const err = error;
                res.status(400).json({ message: err.message, status: false });
            }
        });
    }
    static getJenisPenilaian(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jenisPenilaian = yield praktikum_1.default.getJenisPenilaian();
                res.status(200).json({
                    status: true,
                    data: jenisPenilaian,
                });
            }
            catch (error) {
                const err = error;
                res.status(400).json({ message: err.message, status: false });
            }
        });
    }
}
exports.default = PraktikumControllers;
