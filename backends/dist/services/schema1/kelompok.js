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
class KelompokServices {
    static getKelompokByModul(userId, role, modul_id) {
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
                const kelompoks = yield db1_1.default.kelompok.findMany({
                    where: {
                        modul_id,
                    },
                    select: {
                        id: true,
                        nama_kelompok: true,
                    },
                });
                return kelompoks;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    static getPesertaByModul(userId, role, modul_id) {
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
                const pesertaModul = yield db1_1.default.pesertaModul.findMany({
                    where: { modul_id },
                    select: {
                        id: true,
                        nim: true,
                    },
                });
                const mahasiswaNims = pesertaModul
                    .map((pm) => pm.nim)
                    .filter((nim) => !!nim);
                const [mahasiswaSchema1, mahasiswaSchema2] = yield Promise.all([
                    db1_1.default.mahasiswa
                        .findMany({
                        where: {
                            nim: { in: mahasiswaNims },
                        },
                        select: {
                            id: true,
                            nama_depan: true,
                            nama_belakang: true,
                            nim: true,
                        },
                    })
                        .catch((err) => {
                        console.error("Prisma query error (mahasiswaSchema1):", err);
                        return [];
                    }),
                    db2_1.default.mda_master_mahasiswa
                        .findMany({
                        where: {
                            nim: { in: mahasiswaNims },
                        },
                        select: {
                            id: true,
                            nama_mahasiswa: true,
                            nim: true,
                        },
                    })
                        .catch((err) => {
                        console.error("MySQL query error (mahasiswaSchema2):", err);
                        return [];
                    }),
                ]);
                const mahasiswaSchema2WithNimAngkatan = mahasiswaSchema2.map((user) => {
                    return {
                        id: user.id,
                        nama_siswa: user.nama_mahasiswa || "",
                        nim: user.nim || "",
                    };
                });
                const allMahasiswa = [
                    ...mahasiswaSchema1.map((m) => ({
                        id: m.id,
                        nama_siswa: `${m.nama_depan} ${m.nama_belakang || ""}`.trim(),
                        nim: m.nim,
                    })),
                    ...mahasiswaSchema2WithNimAngkatan,
                ];
                return allMahasiswa;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    static getKelompokAnggota(userId, role, modul_id) {
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
                // Ambil semua kelompok beserta anggota berdasarkan modul_id
                const kelompokList = yield db1_1.default.kelompok.findMany({
                    where: { modul_id },
                    select: {
                        id: true,
                        nama_kelompok: true,
                    },
                });
                // Ambil semua anggota dari kelompokAnggota untuk modul ini beserta nim dari pesertaModul
                const anggotaList = yield db1_1.default.kelompokAnggota.findMany({
                    where: {
                        kelompok: {
                            modul_id,
                        },
                    },
                    select: {
                        kelompok_id: true,
                        peserta_modul_id: true,
                        peserta_modul: {
                            select: {
                                nim: true,
                            },
                        },
                    },
                });
                // Kumpulkan semua nim dari anggota
                const nims = anggotaList.map((anggota) => anggota.peserta_modul.nim);
                console.log("NIMs collected from pesertaModul:", nims);
                // Cari data mahasiswa berdasarkan nim dari schema1 dan schema2
                const [mahasiswaSchema1, mahasiswaSchema2] = yield Promise.all([
                    db1_1.default.mahasiswa
                        .findMany({
                        where: {
                            nim: { in: nims },
                        },
                        select: {
                            id: true,
                            nama_depan: true,
                            nama_belakang: true,
                            nim: true,
                        },
                    })
                        .catch((err) => {
                        console.error("Prisma query error (mahasiswaSchema1):", err);
                        return [];
                    }),
                    db2_1.default.mda_master_mahasiswa
                        .findMany({
                        where: {
                            nim: { in: nims },
                        },
                        select: {
                            id: true,
                            nama_mahasiswa: true,
                            nim: true,
                        },
                    })
                        .catch((err) => {
                        console.error("MySQL query error (mahasiswaSchema2):", err);
                        return [];
                    }),
                ]);
                console.log("mahasiswa schema 1", mahasiswaSchema1);
                console.log("mahasiswa schema 2", mahasiswaSchema2);
                // Validasi duplikat nim antar schema
                const nimSet = new Set();
                const duplicateNims = [];
                [...mahasiswaSchema1, ...mahasiswaSchema2].forEach((m) => {
                    if (nimSet.has(m.nim)) {
                        duplicateNims.push(m.nim);
                    }
                    else {
                        nimSet.add(m.nim);
                    }
                });
                if (duplicateNims.length > 0) {
                    console.warn("Duplicate NIMs found across schemas:", duplicateNims);
                    // Prioritaskan schema1 jika ada duplikat
                    console.log("Prioritizing schema1 for duplicate NIMs");
                }
                // Format data mahasiswa dari schema2
                const mahasiswaSchema2WithNimAngkatan = mahasiswaSchema2.map((user) => ({
                    id: user.id,
                    nama_siswa: user.nama_mahasiswa || "",
                    nim: user.nim || "",
                    schema: "schema2",
                }));
                // Format data mahasiswa dari schema1
                const mahasiswaSchema1Formatted = mahasiswaSchema1.map((m) => ({
                    id: m.id,
                    nama_siswa: `${m.nama_depan} ${m.nama_belakang || ""}`.trim(),
                    nim: m.nim,
                    schema: "schema1",
                }));
                // Gabungkan data mahasiswa dengan prioritas schema1 untuk duplikat nim
                const allMahasiswaMap = new Map();
                mahasiswaSchema2WithNimAngkatan.forEach((m) => {
                    allMahasiswaMap.set(m.nim, m);
                });
                mahasiswaSchema1Formatted.forEach((m) => {
                    allMahasiswaMap.set(m.nim, m); // Schema1 menimpa schema2 jika ada duplikat
                });
                const allMahasiswa = Array.from(allMahasiswaMap.values());
                console.log("Combined mahasiswa:", allMahasiswa);
                // Kelompokkan anggota berdasarkan kelompok
                const result = kelompokList.map((kelompok) => {
                    const anggotaForKelompok = anggotaList
                        .filter((anggota) => anggota.kelompok_id === kelompok.id)
                        .map((anggota) => {
                        const nim = anggota.peserta_modul.nim;
                        const mahasiswa = allMahasiswa.find((m) => m.nim === nim);
                        if (!mahasiswa) {
                            console.warn(`Mahasiswa dengan nim ${nim} tidak ditemukan`);
                            return { id: 0, nama_siswa: "Unknown", nim };
                        }
                        return mahasiswa;
                    });
                    return {
                        id: kelompok.id,
                        nama_kelompok: kelompok.nama_kelompok,
                        anggota: anggotaForKelompok,
                    };
                });
                console.log("Kelompok anggota result:", result);
                return result;
            }
            catch (error) {
                console.error("Error in getPesertaKelompokAnggota:", error);
                throw new Error(error.message);
            }
        });
    }
}
exports.default = KelompokServices;
