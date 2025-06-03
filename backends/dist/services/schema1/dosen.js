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
class DosenServices {
    static getIlmuAndDosen() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ilmu = yield db1_1.default.ilmu.findMany({
                    select: {
                        id: true,
                        nama_ilmu: true,
                    },
                });
                const dosenSchema1 = yield db1_1.default.dosen.findMany({
                    select: {
                        id: true,
                        nama_depan: true,
                    },
                });
                const dosenSchema2 = yield db2_1.default.mda_master_dosen.findMany({
                    select: {
                        id: true,
                        nama_dosen: true,
                    },
                });
                const combinedDosen = Array.from(new Map([...dosenSchema1, ...dosenSchema2].map((dosen) => [dosen.id, dosen])).values());
                return { ilmu, dosen: combinedDosen };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    static getDosenModul(userId_1, role_1) {
        return __awaiter(this, arguments, void 0, function* (userId, role, page = 1, pageSize = 10, search = "") {
            try {
                if (role === "admin") {
                    const existingAdmin = yield db1_1.default.admin.findUnique({
                        where: { id: userId },
                    });
                    if (!existingAdmin) {
                        throw new Error("Admin not found");
                    }
                }
                const modulList = yield db1_1.default.modul.findMany({
                    where: {
                        penanggung_jawab: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    include: {
                        Dosen: {
                            select: {
                                id: true,
                                nama_depan: true,
                            },
                        },
                    },
                    orderBy: {
                        created_at: "desc",
                    },
                });
                const groupedByPenanggungJawab = modulList.reduce((acc, modul) => {
                    const namaDosen = modul.penanggung_jawab || "Tidak ada penanggung jawab";
                    if (!acc[namaDosen]) {
                        acc[namaDosen] = {
                            nama_dosen: namaDosen,
                            total_modul: 0,
                            modul_id: modul.id,
                        };
                    }
                    acc[namaDosen].total_modul += 1;
                    return acc;
                }, {});
                let result = Object.values(groupedByPenanggungJawab);
                const totalItems = result.length;
                const totalPages = Math.ceil(totalItems / pageSize);
                const start = (page - 1) * pageSize;
                const data = result.slice(start, start + pageSize);
                return {
                    data,
                    totalItems,
                    totalPages,
                    currentPage: page,
                    pageSize,
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    static getModulByDosen(userId_1, role_1) {
        return __awaiter(this, arguments, void 0, function* (userId, role, page = 1, limit = 10, searchModul = "", searchSchoolYear = "", penanggungJawab) {
            try {
                if (role === "admin") {
                    const existingAdmin = yield db1_1.default.admin.findUnique({
                        where: { id: userId },
                    });
                    if (!existingAdmin) {
                        throw new Error("Admin not found");
                    }
                }
                const skip = (page - 1) * limit;
                const whereSchema1 = {
                    penanggung_jawab: penanggungJawab,
                    AND: [
                        searchModul ? { nama_modul: { contains: searchModul } } : {},
                        searchSchoolYear
                            ? {
                                OR: [
                                    {
                                        tahun_mulai: {
                                            equals: parseInt(searchSchoolYear.split("/")[0]) || undefined,
                                        },
                                    },
                                    {
                                        tahun_selesai: {
                                            equals: parseInt(searchSchoolYear.split("/")[1]) || undefined,
                                        },
                                    },
                                ].filter((clause) => Object.keys(clause).length > 0),
                            }
                            : {},
                    ].filter((clause) => Object.keys(clause).length > 0),
                };
                const totalModulSchema1 = yield db1_1.default.modul.count({
                    where: whereSchema1,
                });
                const modulListSchema1 = yield db1_1.default.modul.findMany({
                    where: whereSchema1,
                    include: {
                        peserta_moduls: true,
                    },
                    skip,
                    take: limit,
                    orderBy: {
                        created_at: "desc",
                    },
                });
                const dataSchema1 = modulListSchema1.map((modul) => ({
                    id: modul.id,
                    nama_modul: modul.nama_modul,
                    tahun_ajaran: modul.tahun_mulai && modul.tahun_selesai
                        ? `${modul.tahun_mulai}/${modul.tahun_selesai}`
                        : "N/A",
                    total_siswa: modul.peserta_moduls.length,
                }));
                // Filter untuk schema 2 (MySQL - ist_daftar_modul)
                let modulsSchema2 = [];
                let totalModulSchema2 = 0;
                const totalQuery = db2_1.default.$queryRaw `
      SELECT COUNT(*) as count FROM ist_daftar_modul
      WHERE tim_modul = ${penanggungJawab}
      ${searchModul
                    ? db2_1.default.$queryRaw `AND nama_modul LIKE ${`%${searchModul}%`}`
                    : ""}
      ${searchSchoolYear
                    ? db2_1.default.$queryRaw `AND tahun_akademik LIKE ${`%${searchSchoolYear}%`}`
                    : ""}
    `;
                if (totalModulSchema2 > 0) {
                    modulsSchema2 = yield db2_1.default.$queryRaw `
        SELECT * FROM ist_daftar_modul
        WHERE tim_modul = ${penanggungJawab}
        ${searchModul
                        ? db2_1.default.$queryRaw `AND nama_modul LIKE ${`%${searchModul}%`}`
                        : ""}
        ${searchSchoolYear
                        ? db2_1.default.$queryRaw `AND tahun_akademik LIKE ${`%${searchSchoolYear}%`}`
                        : ""}
        ORDER BY waktu_dibuat DESC
        LIMIT ${limit} OFFSET ${skip}
      `;
                }
                const dataSchema2 = modulsSchema2.map((modul) => ({
                    id: modul.id,
                    nama_modul: modul.nama_modul || "N/A",
                    tahun_ajaran: modul.tahun_akademik || "N/A",
                    total_siswa: 0,
                }));
                const data = [...dataSchema1, ...dataSchema2];
                // Total keseluruhan
                const totalModul = totalModulSchema1 + totalModulSchema2;
                const totalPages = Math.ceil(totalModul / limit);
                return {
                    data,
                    totalItems: totalModul,
                    totalPages,
                    currentPage: page,
                    pageSize: limit,
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    static addDosen(userId, role, namaDepan, tanggalLahir, username, password) {
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
                const existingDosen = yield db1_1.default.dosen.findUnique({
                    where: {
                        username,
                    },
                });
                if (existingDosen) {
                    throw new Error("Username sudah ada");
                }
                const parsedDate = new Date(tanggalLahir);
                if (isNaN(parsedDate.getTime())) {
                    throw new Error("Invalid date format");
                }
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const newDosen = yield db1_1.default.dosen.create({
                    data: {
                        nama_depan: namaDepan,
                        tanggal_lahir: parsedDate,
                        username,
                        password: hashedPassword,
                    },
                });
                return newDosen;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = DosenServices;
