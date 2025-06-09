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
const sesi_penilaian_1 = __importDefault(require("../../services/schema1/sesi-penilaian"));
class SesiPenilaianControllers {
    static sesiPenilaian(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { userId, role } = res.locals.user;
                const { action, sesiMulai, sesiSelesai } = req.body;
                const result = yield sesi_penilaian_1.default.sesiPenilaian(userId, role, action, sesiMulai, sesiSelesai);
                res.status(200).json({
                    message: result.message,
                    data: result.data || null,
                    isActive: (_a = result.isActive) !== null && _a !== void 0 ? _a : null,
                    status: true,
                });
            }
            catch (error) {
                const err = error;
                res.status(400).json({ message: err.message, status: false });
            }
        });
    }
    static getSesiPenilaian(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const result = yield sesi_penilaian_1.default.getSesiPenilaian(userId, role);
                res.status(200).json({
                    message: result.message,
                    status: result.status,
                    sesiMulai: result.sesiMulai,
                    sesiSelesai: result.sesiSelesai,
                    isActive: result.isActive,
                    data: result.data,
                    statusCode: true,
                });
            }
            catch (error) {
                const err = error;
                res.status(400).json({ message: err.message, statusCode: false });
            }
        });
    }
}
exports.default = SesiPenilaianControllers;
