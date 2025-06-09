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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthServices {
    static login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [admin, mahasiswaSchema1, dosenSchema1, userSchema2] = yield Promise.all([
                    db1_1.default.admin.findUnique({
                        where: { username, status: "Aktif" },
                    }),
                    db1_1.default.mahasiswa.findUnique({
                        where: { username, status: "Aktif" },
                    }),
                    db1_1.default.dosen.findUnique({
                        where: { username, status: "Aktif" },
                    }),
                    db2_1.default.set_user.findFirst({
                        where: { username, status_user: "Aktif" },
                    }),
                ]);
                let user = null;
                let role = "";
                if (admin) {
                    user = admin;
                    role = "admin";
                }
                else if (mahasiswaSchema1) {
                    user = mahasiswaSchema1;
                    role = "mahasiswa";
                }
                else if (dosenSchema1) {
                    user = dosenSchema1;
                    role = dosenSchema1.role === 'Koordinator' ? 'koordinator' : 'dosen';
                }
                else if (userSchema2) {
                    user = userSchema2;
                    if (userSchema2.tingkat_user === "mahasiswa") {
                        role = "set_user_mahasiswa";
                    }
                    else if (userSchema2.tingkat_user === "dosen") {
                        role = "set_user_dosen";
                    }
                    else {
                        throw new Error("Tipe pengguna tidak valid di set_user");
                    }
                }
                else {
                    throw new Error("Username tidak ditemukan");
                }
                const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    throw new Error("Password tidak valid");
                }
                const accessToken = jsonwebtoken_1.default.sign({
                    id: user.id,
                    username: user.username,
                    role: role,
                }, process.env.SECRET_KEY, { expiresIn: "1d" });
                return {
                    accessToken,
                    role,
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    static getMe(userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = null;
                if (role === "admin") {
                    data = yield db1_1.default.admin.findUnique({
                        where: { id: userId },
                        select: {
                            id: true,
                            username: true,
                            created_at: true,
                            updated_at: true,
                        },
                    });
                }
                else if (role === "mahasiswa") {
                    data = yield db1_1.default.mahasiswa.findUnique({
                        where: { id: userId },
                        select: {
                            id: true,
                            username: true,
                            nama_depan: true,
                            nama_belakang: true,
                            nim: true,
                            created_at: true,
                            updated_at: true,
                        },
                    });
                }
                else if (role === "dosen" || role === 'koordinator') {
                    data = yield db1_1.default.dosen.findUnique({
                        where: { id: userId },
                        select: {
                            id: true,
                            username: true,
                            created_at: true,
                            updated_at: true,
                            role: true
                        },
                    });
                }
                else if (role === "set_user_mahasiswa" || role === "set_user_dosen") {
                    data = yield db2_1.default.set_user.findUnique({
                        where: { id: userId },
                        select: {
                            id: true,
                            username: true,
                            tingkat_user: true,
                            nama: true,
                        },
                    });
                    if ((role === "set_user_mahasiswa" && (data === null || data === void 0 ? void 0 : data.user_type) !== "mahasiswa") ||
                        (role === "set_user_dosen" && (data === null || data === void 0 ? void 0 : data.user_type) !== "dosen")) {
                        throw new Error("Tipe pengguna tidak sesuai dengan data");
                    }
                }
                else {
                    throw new Error("Role pengguna tidak valid");
                }
                if (!data) {
                    throw new Error("User not found");
                }
                return { data, role };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = AuthServices;
