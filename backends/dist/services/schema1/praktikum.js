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
const db1_1 = __importDefault(require("../../lib/db1"));
const db2_1 = __importDefault(require("../../lib/db2"));
class PraktikumServices {
    static getPraktikum() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const praktikums = yield db1_1.default.praktikum.findMany();
                return praktikums;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    static getPraktikumByModul(userId, role, modul_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (role === "admin") {
                    const existingAdmin = yield db1_1.default.admin.findUnique({
                        where: { id: userId },
                    });
                    if (!existingAdmin) {
                        throw new Error("Admin not found");
                    }
                }
                const existingModul = yield db1_1.default.modul.findUnique({
                    where: { id: modul_id },
                });
                if (!existingModul) {
                    throw new Error("Modul not found");
                }
                const praktikumRelations = yield db1_1.default.modulPraktikum.findMany({
                    where: { modul_id },
                    select: { praktikum_id: true },
                });
                const praktikumIds = praktikumRelations.map((relation) => relation.praktikum_id);
                const praktikums = yield db1_1.default.praktikum.findMany({
                    where: { id: { in: praktikumIds } },
                });
                return praktikums;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    static getJenisPenilaian() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jenisPenilaian = yield db2_1.default.mda_jenis_penilaian.findMany({
                    select: {
                        id: true,
                        jenis_penilaian: true
                    }
                });
                return jenisPenilaian;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = PraktikumServices;
