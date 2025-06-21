"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const db2_1 = __importDefault(require("../../lib/db2"));
const db1_1 = __importDefault(require("../../lib/db1"));
const XLSX = __importStar(require("xlsx"));
class ModulServices {
    static getModul() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10, search = "", userId, role, fetchAll = false) {
            var _a;
            try {
                if (role === "admin") {
                    const existingAdmin = yield db1_1.default.admin.findUnique({
                        where: { id: userId },
                    });
                    if (!existingAdmin) {
                        throw new Error("Admin not found");
                    }
                }
                const sanitizedSearch = search ? search.trim() : undefined;
                const whereSchema1 = {
                    nama_modul: sanitizedSearch ? { contains: sanitizedSearch } : {},
                    status: "Aktif",
                };
                const totalSchema1 = yield db1_1.default.modul.count({ where: whereSchema1 });
                const totalSchema2 = yield db2_1.default.$queryRaw `
      SELECT COUNT(*) as count FROM ist_daftar_modul
      WHERE nama_modul LIKE ${sanitizedSearch ? `%${sanitizedSearch}%` : "%%"}
      AND status = 'Aktif'
    `;
                const totalSchema2Count = ((_a = totalSchema2[0]) === null || _a === void 0 ? void 0 : _a.count)
                    ? Number(totalSchema2[0].count)
                    : 0;
                const total = totalSchema1 + totalSchema2Count;
                const totalPages = fetchAll || sanitizedSearch ? 1 : Math.ceil(total / limit);
                console.log(`getModul: totalSchema1: ${totalSchema1}, totalSchema2: ${totalSchema2Count}, total: ${total}, totalPages: ${totalPages}`); // Debugging
                // Ambil data dari Prisma (modulsSchema1)
                let modulsSchema1 = [];
                if (fetchAll || sanitizedSearch) {
                    modulsSchema1 = yield db1_1.default.modul.findMany({
                        where: whereSchema1,
                        include: {
                            bobot_nilai_akhirs: true,
                            bobot_nilai_proses: true,
                            modul_praktikums: { include: { praktikum: true } },
                            sesi_penilaian: { orderBy: { updated_at: "desc" }, take: 1 },
                        },
                        orderBy: { created_at: "desc" },
                    });
                }
                else {
                    const skip = (page - 1) * limit;
                    modulsSchema1 = yield db1_1.default.modul.findMany({
                        skip: Number(skip),
                        take: Number(limit),
                        where: whereSchema1,
                        include: {
                            bobot_nilai_akhirs: true,
                            bobot_nilai_proses: true,
                            modul_praktikums: { include: { praktikum: true } },
                            sesi_penilaian: { orderBy: { updated_at: "desc" }, take: 1 },
                        },
                        orderBy: { created_at: "desc" },
                    });
                }
                console.log(`getModul: Page ${page}, Search: ${sanitizedSearch || "none"}, modulsSchema1 length: ${modulsSchema1.length}`); // Debugging
                // Ambil data dari MySQL (modulsSchema2)
                let modulsSchema2 = [];
                if (fetchAll || sanitizedSearch) {
                    if (sanitizedSearch) {
                        modulsSchema2 = yield db2_1.default.$queryRaw `
          SELECT * FROM ist_daftar_modul
          WHERE nama_modul LIKE ${`%${sanitizedSearch}%`}
          AND status = 'Aktif'
          ORDER BY waktu_dibuat DESC
        `;
                    }
                    else {
                        modulsSchema2 = yield db2_1.default.$queryRaw `
          SELECT * FROM ist_daftar_modul
          WHERE status = 'Aktif'
          ORDER BY waktu_dibuat DESC
        `;
                    }
                }
                else {
                    const remainingLimit = limit - modulsSchema1.length;
                    if (remainingLimit > 0) {
                        const skip = Math.max(0, (page - 1) * limit - totalSchema1);
                        if (sanitizedSearch) {
                            modulsSchema2 = yield db2_1.default.$queryRaw `
            SELECT * FROM ist_daftar_modul
            WHERE nama_modul LIKE ${`%${sanitizedSearch}%`}
            AND status = 'Aktif'
            ORDER BY waktu_dibuat DESC
            LIMIT ${remainingLimit} OFFSET ${skip}
          `;
                        }
                        else {
                            modulsSchema2 = yield db2_1.default.$queryRaw `
            SELECT * FROM ist_daftar_modul
            WHERE status = 'Aktif'
            ORDER BY waktu_dibuat DESC
            LIMIT ${remainingLimit} OFFSET ${skip}
          `;
                        }
                    }
                }
                console.log(`getModul: Page ${page}, Search: ${sanitizedSearch || "none"}, modulsSchema2 length: ${modulsSchema2.length}`); // Debugging
                // Ambil tahun ajaran dari kedua schema
                const allYearsSchema1 = modulsSchema1.map((item) => {
                    const tahunAjaranMulai = item.tahun_mulai;
                    const tahunAjaranSelesai = item.tahun_selesai;
                    return tahunAjaranMulai && tahunAjaranSelesai
                        ? `${tahunAjaranMulai}-${tahunAjaranSelesai}`
                        : "N/A";
                });
                const allYearsSchema2 = modulsSchema2.map((item) => item.tahun_akademik || "N/A");
                const allYears = [
                    ...new Set([...allYearsSchema1, ...allYearsSchema2]),
                ].filter((year) => year !== "N/A");
                // Hitung jumlah peserta untuk modulsSchema1
                const modulIdsSchema1 = modulsSchema1.map((item) => item.id);
                const pesertaCounts = yield db1_1.default.pesertaModul.groupBy({
                    by: ["modul_id"],
                    _count: { id: true },
                    where: { modul_id: { in: modulIdsSchema1 } },
                });
                const pesertaMap = new Map(pesertaCounts.map((item) => [item.modul_id, item._count.id]));
                // Transformasi dataSchema1
                const dataSchema1 = modulsSchema1.map((item, index) => {
                    var _a, _b;
                    const latestSesi = item.sesi_penilaian[0];
                    const tahunAjaranMulai = item.tahun_mulai;
                    const tahunAjaranSelesai = item.tahun_selesai;
                    const tahun_ajaran_str = tahunAjaranMulai && tahunAjaranSelesai
                        ? `${tahunAjaranMulai}-${tahunAjaranSelesai}`
                        : "N/A";
                    const tahun_ajaran_final = allYears.includes(tahun_ajaran_str)
                        ? tahun_ajaran_str
                        : "N/A";
                    return {
                        id: item.id,
                        nama_modul: item.nama_modul || "N/A",
                        tahun_ajaran: tahun_ajaran_final,
                        penanggung_jawab: item.penanggung_jawab || "N/A",
                        total_siswa: pesertaMap.get(item.id) || 0,
                        tanggal_buat: ((_a = item.created_at) === null || _a === void 0 ? void 0 : _a.toISOString().split("T")[0]) ||
                            new Date().toISOString().split("T")[0],
                        tanggal_update: ((_b = item.updated_at) === null || _b === void 0 ? void 0 : _b.toISOString().split("T")[0]) ||
                            new Date().toISOString().split("T")[0],
                        sesi_diaktifkan: (latestSesi === null || latestSesi === void 0 ? void 0 : latestSesi.sesi_mulai.toISOString().split("T")[0]) || "N/A",
                        sesi_dinonaktifkan: (latestSesi === null || latestSesi === void 0 ? void 0 : latestSesi.sesi_selesai.toISOString().split("T")[0]) || "N/A",
                        praktikums: item.modul_praktikums.map((mp) => mp.praktikum.nama).join(", ") ||
                            "N/A",
                        no: fetchAll || sanitizedSearch
                            ? index + 1
                            : (page - 1) * limit + index + 1,
                    };
                });
                // Transformasi dataSchema2
                const dataSchema2 = modulsSchema2.map((item, index) => {
                    const tahun_ajaran_final = allYears.includes(item.tahun_akademik)
                        ? item.tahun_akademik
                        : "N/A";
                    return {
                        id: item.id,
                        nama_modul: item.nama_modul || "N/A",
                        tahun_ajaran: tahun_ajaran_final,
                        penanggung_jawab: item.tim_modul || "N/A",
                        total_siswa: 0,
                        tanggal_buat: item.waktu_dibuat
                            ? new Date(item.waktu_dibuat).toISOString().split("T")[0]
                            : new Date().toISOString().split("T")[0],
                        tanggal_update: item.waktu_dirubah
                            ? new Date(item.waktu_dirubah).toISOString().split("T")[0]
                            : new Date().toISOString().split("T")[0],
                        sesi_diaktifkan: item.tanggal_mulai || "N/A",
                        sesi_dinonaktifkan: item.tanggal_selesai || "N/A",
                        praktikums: "N/A",
                        no: fetchAll || sanitizedSearch
                            ? dataSchema1.length + index + 1
                            : (page - 1) * limit + dataSchema1.length + index + 1,
                    };
                });
                // Gabungkan data dan deduplikasi
                let data = [...dataSchema1, ...dataSchema2];
                const uniqueData = Array.from(new Map(data.map((item) => [item.id, item])).values());
                data = uniqueData.sort((a, b) => {
                    const dateA = a.tanggal_buat ? new Date(a.tanggal_buat).getTime() : 0;
                    const dateB = b.tanggal_buat ? new Date(b.tanggal_buat).getTime() : 0;
                    return dateB - dateA;
                });
                let finalData = data;
                if (!fetchAll && !sanitizedSearch) {
                    finalData = data.slice(0, limit);
                }
                // Perbarui nomor urut
                finalData = finalData.map((item, index) => (Object.assign(Object.assign({}, item), { no: fetchAll || sanitizedSearch
                        ? index + 1
                        : (page - 1) * limit + index + 1 })));
                console.log(`getModul: Page ${page}, Search: ${sanitizedSearch || "none"}, Data length after deduplication: ${data.length}`); // Debugging
                console.log(`getModul: Page ${page}, Search: ${sanitizedSearch || "none"}, Final data length: ${finalData.length}`); // Debugging
                console.log(`getModul: Final Data IDs: ${finalData.map((item) => item.id)}`); // Debugging
                return {
                    data: finalData,
                    currentPage: fetchAll || sanitizedSearch ? 1 : Number(page),
                    totalPages: fetchAll || sanitizedSearch ? 1 : totalPages,
                    totalItems: total,
                    itemsPerPage: fetchAll || sanitizedSearch ? finalData.length : Number(limit),
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    static createModul(nama_modul, tahun_mulai, tahun_selesai, penanggung_jawab, praktikum_id, userId, role, bobot_nilai_akhir, bobot_nilai_proses_default, bobot_nilai_proses) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validasi admin dari schema1
                if (role === "admin") {
                    const existingAdmin = yield db1_1.default.admin.findUnique({
                        where: { id: userId },
                    });
                    if (!existingAdmin) {
                        throw new Error("Admin not found");
                    }
                }
                // Validasi praktikum (pastikan semua ID praktikum valid)
                const existingPraktikums = yield db1_1.default.praktikum.findMany({
                    where: { id: { in: praktikum_id } },
                });
                if (existingPraktikums.length !== praktikum_id.length) {
                    throw new Error("One or more praktikum IDs are invalid");
                }
                const normalizedBobotAkhir = bobot_nilai_akhir || {
                    sumatif: 0,
                    proses: 0,
                    praktikum: 0,
                };
                if (bobot_nilai_akhir) {
                    const totalBobotAkhir = normalizedBobotAkhir.sumatif +
                        normalizedBobotAkhir.proses +
                        normalizedBobotAkhir.praktikum;
                    if (totalBobotAkhir !== 100) {
                        throw new Error("Total bobot nilai akhir harus 100%");
                    }
                }
                // Validasi bobot nilai proses (total 100%)
                const normalizedBobotProsesDefault = bobot_nilai_proses_default || {
                    diskusi: 0,
                    buku_catatan: 0,
                    temu_pakar: 0,
                    peta_konsep: 0,
                    kkd: 0,
                };
                if (bobot_nilai_proses_default) {
                    const totalBobotProsesDefault = normalizedBobotProsesDefault.diskusi +
                        normalizedBobotProsesDefault.buku_catatan +
                        normalizedBobotProsesDefault.temu_pakar +
                        normalizedBobotProsesDefault.peta_konsep +
                        normalizedBobotProsesDefault.kkd;
                    if (totalBobotProsesDefault > 100) {
                        throw new Error("Total bobot nilai proses default tidak boleh lebih dari 100%");
                    }
                }
                const normalizedBobotProsesDinamis = bobot_nilai_proses || {};
                if (bobot_nilai_proses) {
                    const totalBobotProses = Object.values(normalizedBobotProsesDinamis).reduce((sum, nilai) => sum + (nilai !== null && nilai !== void 0 ? nilai : 0), 0);
                    if (totalBobotProses > 100) {
                        throw new Error("Total nilai proses tidak boleh lebih dari 100%");
                    }
                    const invalidEntries = Object.entries(normalizedBobotProsesDinamis).filter(([_, nilai]) => typeof nilai !== "number" || nilai < 0);
                    if (invalidEntries.length > 0) {
                        throw new Error(`Nilai untuk ${invalidEntries[0][0]} harus berupa angka tidak negatif`);
                    }
                }
                // Transaksi untuk membuat modul, sesi penilaian, dan praktikum
                const newModul = yield db1_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const modul = yield tx.modul.create({
                        data: {
                            nama_modul: nama_modul,
                            tahun_mulai,
                            tahun_selesai,
                            penanggung_jawab,
                        },
                    });
                    yield tx.bobotNilaiAkhir.create({
                        data: {
                            modul_id: modul.id,
                            nilai_sumatif: normalizedBobotAkhir.sumatif,
                            nilai_proses: normalizedBobotAkhir.proses,
                            nilai_praktik: normalizedBobotAkhir.praktikum,
                        },
                    });
                    yield tx.bobotNilaiProses.create({
                        data: {
                            modul_id: modul.id,
                            diskusi: normalizedBobotProsesDefault.diskusi,
                            buku_catatan: normalizedBobotProsesDefault.buku_catatan,
                            temu_pakar: normalizedBobotProsesDefault.temu_pakar,
                            peta_konsep: normalizedBobotProsesDefault.peta_konsep,
                            proses_praktik: normalizedBobotProsesDefault.kkd,
                            nilai_proses: Object.keys(normalizedBobotProsesDinamis).length > 0
                                ? normalizedBobotProsesDinamis
                                : {},
                        },
                    });
                    // await tx.bobotNilaiProses.create({
                    //   data: {
                    //     modul_id: modul.id,
                    //     diskusi: bobot_nilai_proses.diskusi,
                    //     buku_catatan: bobot_nilai_proses.buku_catatan,
                    //     temu_pakar: bobot_nilai_proses.temu_pakar,
                    //     peta_konsep: bobot_nilai_proses.peta_konsep,
                    //     proses_praktik: bobot_nilai_proses.proses_praktik,
                    //   },
                    // });
                    yield tx.modulPraktikum.createMany({
                        data: praktikum_id.map((praktikum_id) => ({
                            modul_id: modul.id,
                            praktikum_id,
                        })),
                    });
                    return modul;
                }));
                const relatedPraktikumIds = yield db1_1.default.modulPraktikum
                    .findMany({
                    where: { modul_id: newModul.id },
                    select: { praktikum_id: true },
                })
                    .then((result) => result.map((item) => item.praktikum_id));
                return Object.assign(Object.assign({}, newModul), { praktikum_id: relatedPraktikumIds });
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    static addPemicu(userId, role, modul_id, pemicus) {
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
                    where: {
                        id: modul_id,
                    },
                });
                if (!existingModul) {
                    throw new Error("Modul not found");
                }
                const ilmuIds = pemicus.map((p) => p.ilmuId);
                const existingIlmu = yield db1_1.default.ilmu.findMany({
                    where: {
                        id: {
                            in: ilmuIds,
                        },
                    },
                });
                const dokterIds = pemicus.map((p) => p.dokterId);
                const existingDokter = yield db2_1.default.mda_master_dosen.findMany({
                    where: {
                        id: {
                            in: dokterIds,
                        },
                    },
                    select: {
                        id: true,
                        nama_dosen: true,
                    },
                });
                const newPemicus = yield db1_1.default.$transaction(pemicus.map((pemicu) => db1_1.default.pemicu.create({
                    data: {
                        modul_id,
                        nomor_pemicu: pemicu.nomor_pemicu,
                        ilmu_id: pemicu.ilmuId,
                        dosen_id: pemicu.dokterId,
                    },
                    include: {
                        ilmu: true,
                        modul: true,
                    },
                })));
                const formattedPemicus = newPemicus.map((p) => {
                    var _a, _b;
                    return ({
                        id: p.id,
                        modul_id: p.modul_id,
                        nama_modul: p.modul.nama_modul,
                        nomor_pemicu: p.nomor_pemicu,
                        ilmu: ((_a = existingIlmu.find((i) => i.id === p.ilmu_id)) === null || _a === void 0 ? void 0 : _a.nama_ilmu) || "N/A",
                        dokter: ((_b = existingDokter.find((d) => d.id === p.dosen_id)) === null || _b === void 0 ? void 0 : _b.nama_dosen) || "N/A",
                    });
                });
                return formattedPemicus;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    static addPenilaianModul(userId, role, modul_id, penilaianProses, total_soal_sum1, total_soal_sum2, total_soal_her_sum1, total_soal_her_sum2) {
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
                const praktikumIds = penilaianProses.map((p) => p.praktikum_id);
                const modulPraktikums = yield db1_1.default.modulPraktikum.findMany({
                    where: { modul_id: modul_id, praktikum_id: { in: praktikumIds } },
                    select: { praktikum_id: true, praktikum: true },
                });
                const validPraktikumIds = modulPraktikums.map((p) => p.praktikum_id);
                const invalidPraktikums = praktikumIds.filter((id) => !validPraktikumIds.includes(id));
                if (invalidPraktikums.length > 0) {
                    throw new Error(`Praktikum dengan ID ${invalidPraktikums.join(", ")} tidak terkait dengan modul ini`);
                }
                // Validasi jenis nilai ada di schema2
                const jenisNilaiIds = penilaianProses.map((p) => p.jenis_nilai_id);
                const jenisPenilaianList = yield db2_1.default.mda_jenis_penilaian.findMany({
                    where: { id: { in: jenisNilaiIds } },
                    select: { id: true, jenis_penilaian: true },
                });
                const validJenisNilaiIds = jenisPenilaianList.map((j) => j.id);
                const invalidJenisNilai = jenisNilaiIds.filter((id) => !validJenisNilaiIds.includes(id));
                if (invalidJenisNilai.length > 0) {
                    throw new Error(`Jenis nilai dengan ID ${invalidJenisNilai.join(", ")} tidak ditemukan`);
                }
                // Validasi total bobot penilaian proses = 100%
                const totalBobot = penilaianProses.reduce((sum, p) => { var _a; return sum + ((_a = p.bobot) !== null && _a !== void 0 ? _a : 0); }, 0);
                if (totalBobot > 100) {
                    throw new Error("Total bobot penilaian proses tidak boleh lebih dari 100%");
                }
                const newPenilaianModul = yield db1_1.default.penilaianModul.create({
                    data: {
                        modul_id: modul_id,
                        total_soal_sum1: total_soal_sum1 !== null && total_soal_sum1 !== void 0 ? total_soal_sum1 : null,
                        total_soal_sum2: total_soal_sum2 !== null && total_soal_sum2 !== void 0 ? total_soal_sum2 : null,
                        total_her_sum1: total_soal_her_sum1 !== null && total_soal_her_sum1 !== void 0 ? total_soal_her_sum1 : null,
                        total_her_sum2: total_soal_her_sum2 !== null && total_soal_her_sum2 !== void 0 ? total_soal_her_sum2 : null,
                        penilaian_proses_praktikums: {
                            create: penilaianProses && penilaianProses.length > 0
                                ? penilaianProses.map((p) => {
                                    var _a;
                                    return ({
                                        praktikum_id: p.praktikum_id,
                                        jenis_nilai_id: p.jenis_nilai_id,
                                        bobot: (_a = p.bobot) !== null && _a !== void 0 ? _a : null,
                                    });
                                })
                                : [],
                        },
                    },
                    include: {
                        modul: true,
                        penilaian_proses_praktikums: true,
                    },
                });
                return newPenilaianModul;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    static getModulById(userId, role, modul_id) {
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
                const modul = yield db1_1.default.modul.findFirst({
                    where: {
                        id: modul_id,
                    },
                    include: {
                        pemicus: {
                            include: {
                                ilmu: true,
                            },
                        },
                        bobot_nilai_akhirs: true,
                        bobot_nilai_proses: true,
                        modul_praktikums: {
                            include: {
                                praktikum: true,
                            },
                        },
                        penilaian_moduls: {
                            include: {
                                penilaian_proses_praktikums: {
                                    include: {
                                        praktikum: true,
                                    },
                                },
                            },
                        },
                        peserta_moduls: {
                            select: {
                                id: true,
                                nim: true,
                                created_at: true,
                                updated_at: true,
                            },
                        },
                        kelompoks: {
                            include: {
                                anggotas: {
                                    include: {
                                        peserta_modul: true,
                                    },
                                },
                            },
                        },
                    },
                });
                if (!modul) {
                    throw new Error("Modul not found");
                }
                const nims = modul.peserta_moduls.map((pm) => pm.nim);
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
                            angkatan: true,
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
                            angkatan: true,
                        },
                    })
                        .catch((err) => {
                        console.error("MySQL query error (mahasiswaSchema2):", err);
                        return [];
                    }),
                ]);
                console.log("mahasiswa schema 1", mahasiswaSchema1);
                console.log("mahasiswa schema 2", mahasiswaSchema2);
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
                const mahasiswaSchema2WithNimAngkatan = mahasiswaSchema2.map((user) => ({
                    id: user.id,
                    nama_siswa: user.nama_mahasiswa || "",
                    nim: user.nim || "",
                    angkatan: user.angkatan || null,
                }));
                const mahasiswaSchema1Formatted = mahasiswaSchema1.map((m) => ({
                    id: m.id,
                    nama_siswa: `${m.nama_depan} ${m.nama_belakang || ""} `.trim(),
                    nim: m.nim || "",
                    angkatan: m.angkatan || null,
                }));
                const allMahasiswaMap = new Map();
                mahasiswaSchema2WithNimAngkatan.forEach((m) => {
                    allMahasiswaMap.set(m.nim, m);
                });
                mahasiswaSchema1Formatted.forEach((m) => {
                    allMahasiswaMap.set(m.nim, m); // Schema1 menimpa schema2 jika ada duplikat
                });
                const allMahasiswa = Array.from(allMahasiswaMap.values());
                console.log("Combined mahasiswa:", allMahasiswa);
                const pesertaKelompokMap = {};
                modul.kelompoks.forEach((kelompok) => {
                    const match = kelompok.nama_kelompok.match(/Kelompok (\d+)/);
                    const nomorKelompok = match ? parseInt(match[1], 10) : null;
                    kelompok.anggotas.forEach((anggota) => {
                        if (anggota.peserta_modul_id) {
                            pesertaKelompokMap[anggota.peserta_modul_id] = nomorKelompok;
                        }
                    });
                });
                const dosenIds = modul.pemicus
                    .map((p) => p.dosen_id)
                    .filter((id) => id !== null && id !== undefined);
                const dosenList = dosenIds.length > 0
                    ? yield db2_1.default.mda_master_dosen.findMany({
                        where: { id: { in: dosenIds } },
                        select: { id: true, nama_dosen: true },
                    })
                    : [];
                const jenisNilaiIds = modul.penilaian_moduls
                    .flatMap((pm) => pm.penilaian_proses_praktikums.map((ppp) => ppp.jenis_nilai_id))
                    .filter((id) => id !== null && id !== undefined);
                const jenisPenilaianList = jenisNilaiIds.length > 0
                    ? yield db2_1.default.mda_jenis_penilaian.findMany({
                        where: { id: { in: jenisNilaiIds } },
                        select: { id: true, jenis_penilaian: true },
                    })
                    : [];
                const formattedModul = {
                    id: Number(modul.id),
                    nama_modul: String(modul.nama_modul),
                    penanggung_jawab: String(modul.penanggung_jawab),
                    tahun_mulai: Number(modul.tahun_mulai),
                    tahun_selesai: Number(modul.tahun_selesai),
                    total_siswa: Number(modul.total_siswa),
                    created_at: modul.created_at.toISOString(),
                    updated_at: modul.updated_at.toISOString(),
                    dosenId: modul.dosenId !== null ? Number(modul.dosenId) : null,
                    tahunAjaranId: modul.tahunAjaranId !== null ? Number(modul.tahunAjaranId) : null,
                    bobot_nilai_akhir: modul.bobot_nilai_akhirs.map((p) => ({
                        id: Number(p.id),
                        nilaiSumatif: Number(p.nilai_sumatif),
                        nilaiProses: Number(p.nilai_proses),
                        nilaiPraktik: Number(p.nilai_praktik),
                    })),
                    bobot_nilai_proses: modul.bobot_nilai_proses.map((p) => ({
                        id: Number(p.id),
                        diskusiKelompok: Number(p.diskusi),
                        bukuCatatan: Number(p.buku_catatan),
                        temuPakar: Number(p.temu_pakar),
                        petaKonsep: Number(p.peta_konsep),
                        prosesPraktikum: Number(p.proses_praktik),
                        nilai: p.nilai_proses,
                    })),
                    praktikums: modul.modul_praktikums.map((p) => ({
                        id: Number(p.praktikum_id),
                        praktikum: p.praktikum.nama,
                    })),
                    pemicus: modul.pemicus.map((p) => {
                        var _a;
                        return ({
                            id: Number(p.id),
                            nomorPemicu: Number(p.nomor_pemicu),
                            ilmuNama: p.ilmu ? String(p.ilmu.nama_ilmu) : "N/A",
                            dosenNama: p.dosen_id
                                ? String(((_a = dosenList.find((d) => d.id === p.dosen_id)) === null || _a === void 0 ? void 0 : _a.nama_dosen) || "N/A")
                                : null,
                            created_at: p.created_at.toISOString(),
                            updated_at: p.updated_at.toISOString(),
                        });
                    }),
                    penilaian_moduls: modul.penilaian_moduls.map((pm) => ({
                        id: Number(pm.id),
                        modul_id: Number(pm.modul_id),
                        total_soal_sum1: Number(pm.total_soal_sum1),
                        total_soal_sum2: Number(pm.total_soal_sum2),
                        total_her_sum1: Number(pm.total_her_sum1),
                        total_her_sum2: Number(pm.total_her_sum2),
                        created_at: pm.created_at.toISOString(),
                        updated_at: pm.updated_at.toISOString(),
                        penilaian_proses_praktikums: pm.penilaian_proses_praktikums.map((ppp) => {
                            var _a;
                            return ({
                                id: Number(ppp.id),
                                praktikum: ppp.praktikum
                                    ? {
                                        id: Number(ppp.praktikum.id),
                                        nama: String(ppp.praktikum.nama),
                                    }
                                    : null,
                                jenis_nilai: ppp.jenis_nilai ? String(ppp.jenis_nilai) : null,
                                jenis_nilai_id: ppp.jenis_nilai_id !== null ? Number(ppp.jenis_nilai_id) : null,
                                jenis_nilai_nama: ppp.jenis_nilai_id
                                    ? String(((_a = jenisPenilaianList.find((j) => j.id === ppp.jenis_nilai_id)) === null || _a === void 0 ? void 0 : _a.jenis_penilaian) || "N/A")
                                    : null,
                                bobot: Number(ppp.bobot),
                                created_at: ppp.created_at.toISOString(),
                                updated_at: ppp.updated_at.toISOString(),
                            });
                        }),
                    })),
                    peserta_moduls: modul.peserta_moduls.map((pm) => {
                        const mahasiswa = allMahasiswa.find((m) => m.nim === pm.nim);
                        return {
                            id: Number(pm.id),
                            nama_siswa: mahasiswa
                                ? mahasiswa.nama_siswa
                                : "Nama tidak ditemukan",
                            nim: pm.nim,
                            angkatan: mahasiswa ? mahasiswa.angkatan : null,
                            kelompok_nomor: pesertaKelompokMap[pm.id] || null,
                            created_at: pm.created_at.toISOString(),
                            updated_at: pm.updated_at.toISOString(),
                        };
                    }),
                    kelompoks: modul.kelompoks.map((k) => ({
                        id: Number(k.id),
                        created_at: k.created_at.toISOString(),
                        updated_at: k.updated_at.toISOString(),
                    })),
                };
                return formattedModul;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    static addPeserta(userId, role, modul_id, mahasiswaId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mahasiswaId || !Array.isArray(mahasiswaId)) {
                    throw new Error("mahasiswaId is undefined or not an array");
                }
                if (mahasiswaId.length === 0) {
                    throw new Error("mahasiswaId is empty");
                }
                if (mahasiswaId.some((id) => typeof id !== "number" || isNaN(id))) {
                    throw new Error("mahasiswaId contains invalid numbers");
                }
                if (role === "admin") {
                    const existingAdmin = yield db1_1.default.admin.findUnique({
                        where: { id: userId },
                    });
                    if (!existingAdmin) {
                        throw new Error("Admin not found");
                    }
                }
                const modul = yield db1_1.default.modul.findUnique({
                    where: { id: modul_id },
                });
                if (!modul) {
                    throw new Error("Modul not found");
                }
                console.log("Querying mahasiswa with ids:", mahasiswaId);
                const [mahasiswaSchema1, mahasiswaSchema2] = yield Promise.all([
                    db1_1.default.mahasiswa
                        .findMany({
                        where: {
                            id: { in: mahasiswaId },
                        },
                        select: {
                            id: true,
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
                            id: { in: mahasiswaId },
                        },
                        select: {
                            id: true,
                            nim: true,
                        },
                    })
                        .catch((err) => {
                        console.error("MySQL query error (mahasiswaSchema2):", err);
                        return [];
                    }),
                ]);
                if (!Array.isArray(mahasiswaSchema1)) {
                    throw new Error("mahasiswaSchema1 is not an array");
                }
                if (!Array.isArray(mahasiswaSchema2)) {
                    throw new Error("mahasiswaSchema2 is not an array");
                }
                const idToNimMap = new Map([
                    ...mahasiswaSchema1.map((m) => [m.id, { nim: m.nim, mahasiswaId: m.id }]),
                    ...mahasiswaSchema2.map((m) => [m.id, { nim: m.nim, mahasiswaId: m.id }]),
                ]);
                const invalidIds = mahasiswaId.filter((id) => !idToNimMap.has(id));
                if (invalidIds.length > 0) {
                    throw new Error(`Invalid mahasiswa_ids: ${invalidIds.join(", ")}`);
                }
                const validNims = mahasiswaId
                    .map((id) => idToNimMap.get(id).nim)
                    .filter((nim) => nim !== null);
                const existingPeserta = yield db1_1.default.pesertaModul.findMany({
                    where: {
                        modul_id,
                        nim: { in: validNims },
                    },
                    select: {
                        nim: true,
                    },
                });
                const existingNims = existingPeserta.map((p) => p.nim);
                const newMahasiswaIds = mahasiswaId.filter((id) => {
                    const nim = idToNimMap.get(id).nim;
                    return nim !== null && !existingNims.includes(nim);
                });
                if (newMahasiswaIds.length === 0) {
                    throw new Error("Mahasiswa yang terpilih sudah terdaftar untuk modul ini");
                }
                const mahasiswaIdsToValidate = newMahasiswaIds
                    .map((id) => idToNimMap.get(id).mahasiswaId)
                    .filter((id) => id !== null);
                let validMahasiswaIds = [];
                if (mahasiswaIdsToValidate.length > 0) {
                    const existingMahasiswa = yield db1_1.default.mahasiswa.findMany({
                        where: {
                            id: { in: mahasiswaIdsToValidate },
                        },
                        select: {
                            id: true,
                        },
                    });
                    validMahasiswaIds = existingMahasiswa.map((m) => m.id);
                }
                const pesertaRecords = newMahasiswaIds.map((mahasiswaId) => {
                    const { nim, mahasiswaId: mId } = idToNimMap.get(mahasiswaId);
                    if (nim === null) {
                        throw new Error(`Nim is null for mahasiswaId: ${mahasiswaId}`);
                    }
                    const finalMahasiswaId = mId && validMahasiswaIds.includes(mId) ? mId : null;
                    return {
                        modul_id,
                        nim: nim,
                        mahasiswaId: finalMahasiswaId,
                        created_at: new Date(),
                        updated_at: new Date(),
                    };
                });
                yield db1_1.default.pesertaModul.createMany({
                    data: pesertaRecords,
                });
                return {
                    success: true,
                    message: `Tambah peserta di modul id ${modul_id} berhasil`,
                };
            }
            catch (error) {
                console.error("Error in addPeserta:", error);
                throw new Error(error.message);
            }
        });
    }
    static createKelompok(userId, role, modul_id) {
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
                const modul = yield db1_1.default.modul.findUnique({
                    where: { id: modul_id },
                });
                if (!modul) {
                    throw new Error("Modul not found");
                }
                const kelompokCount = yield db1_1.default.kelompok.count({
                    where: {
                        modul_id,
                    },
                });
                const newKelompokName = `Kelompok ${kelompokCount + 1}`;
                const kelompok = yield db1_1.default.kelompok.create({
                    data: {
                        modul_id,
                        nama_kelompok: newKelompokName,
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });
                return kelompok;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    static deleteKelompok(userId, role, modul_id, kelompokId) {
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
                const modul = yield db1_1.default.modul.findUnique({
                    where: { id: modul_id },
                });
                if (!modul) {
                    throw new Error("Modul tidak ditemukan");
                }
                const kelompok = yield db1_1.default.kelompok.findFirst({
                    where: {
                        id: kelompokId,
                        modul_id,
                    },
                });
                if (!kelompok) {
                    throw new Error("Kelompok tidak ditemukan");
                }
                yield db1_1.default.kelompok.delete({
                    where: { id: kelompok.id },
                });
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    static addPesertaToKelompok(userId, role, modul_id, kelompokId, nims) {
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
                const modul = yield db1_1.default.modul.findUnique({
                    where: { id: modul_id },
                });
                if (!modul) {
                    throw new Error("Modul not found");
                }
                const kelompok = yield db1_1.default.kelompok.findUnique({
                    where: {
                        id: kelompokId,
                    },
                });
                if (!kelompok || kelompok.modul_id !== modul_id) {
                    throw new Error("Kelompok tidak ditemukan atau tidak terkait dengan modul ini");
                }
                const existingPesertaModul = yield db1_1.default.pesertaModul.findMany({
                    where: {
                        nim: { in: nims },
                        modul_id,
                    },
                    select: {
                        id: true,
                        nim: true,
                    },
                });
                console.log("Received nims:", nims);
                console.log("Found pesertaModul:", existingPesertaModul);
                if (existingPesertaModul.length !== nims.length) {
                    const validNims = existingPesertaModul.map((p) => p.nim);
                    const invalidNims = nims.filter((nim) => !validNims.includes(nim));
                    throw new Error(`Nims tidak valid atau tidak terkait: ${invalidNims.join(", ")}`);
                }
                const nimCount = yield db1_1.default.pesertaModul.groupBy({
                    by: ["nim"],
                    where: { modul_id, nim: { in: nims } },
                    _count: { nim: true },
                });
                const duplicateNims = nimCount
                    .filter((nc) => nc._count.nim > 1)
                    .map((nc) => nc.nim);
                if (duplicateNims.length > 0) {
                    throw new Error(`Duplikat NIM ditemukan: ${duplicateNims.join(", ")}`);
                }
                const pesertaModulIds = existingPesertaModul.map((pm) => pm.id);
                console.log("Generated pesertaModulIds:", pesertaModulIds);
                const existingAnggota = yield db1_1.default.kelompokAnggota.findMany({
                    where: {
                        peserta_modul_id: { in: pesertaModulIds },
                    },
                    select: {
                        id: true,
                        peserta_modul_id: true,
                        kelompok_id: true,
                    },
                });
                const pesertaToUpdateIds = existingAnggota
                    .filter((a) => a.kelompok_id !== kelompokId)
                    .map((a) => a.peserta_modul_id);
                const pesertaToAddIds = pesertaModulIds.filter((id) => !existingAnggota.some((a) => a.peserta_modul_id === id));
                if (pesertaToUpdateIds.length === 0 && pesertaToAddIds.length === 0) {
                    throw new Error("Tidak ada peserta yang perlu dipindahkan atau ditambahkan");
                }
                yield db1_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    if (pesertaToUpdateIds.length > 0) {
                        yield tx.kelompokAnggota.updateMany({
                            where: {
                                peserta_modul_id: { in: pesertaToUpdateIds },
                            },
                            data: {
                                kelompok_id: kelompokId,
                                updated_at: new Date(),
                            },
                        });
                    }
                    if (pesertaToAddIds.length > 0) {
                        yield tx.kelompokAnggota.createMany({
                            data: pesertaToAddIds.map((pesertaModulId) => ({
                                kelompok_id: kelompokId,
                                peserta_modul_id: pesertaModulId,
                                created_at: new Date(),
                                updated_at: new Date(),
                            })),
                        });
                    }
                }));
                const updatedAnggota = yield db1_1.default.kelompokAnggota.findMany({
                    where: { kelompok_id: kelompokId },
                    include: {
                        peserta_modul: { select: { nim: true } },
                    },
                });
                console.log("Updated anggota in kelompok:", updatedAnggota);
                return updatedAnggota;
            }
            catch (error) {
                console.error("Error in addPesertaToKelompok:", error);
                throw new Error(error.message);
            }
        });
    }
    static deletePesertaFromKelompok(userId, role, kelompokAnggotaId) {
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
                const kelompokAnggota = yield db1_1.default.kelompokAnggota.findUnique({
                    where: { id: kelompokAnggotaId },
                    include: {
                        kelompok: true,
                        peserta_modul: { select: { nim: true } },
                    },
                });
                if (!kelompokAnggota) {
                    throw new Error("Anggota kelompok tidak ditemukan");
                }
                if (!kelompokAnggota.kelompok) {
                    throw new Error("Kelompok terkait tidak ditemukan");
                }
                yield db1_1.default.kelompokAnggota.delete({
                    where: { id: kelompokAnggotaId },
                });
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    static deleteModul(userId, role, modulId) {
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
                    where: {
                        id: modulId,
                    },
                });
                if (!existingModul) {
                    throw new Error("Modul not found");
                }
                yield db1_1.default.modul.update({
                    where: { id: modulId },
                    data: {
                        status: "Nonaktif",
                        updated_at: new Date(),
                    },
                });
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    static updateModul(userId, role, modulId, nama_modul, penanggung_jawab, bobot_nilai_proses_default, bobot_nilai_proses, total_soal_sum1, total_soal_sum2, total_soal_her_sum1, total_soal_her_sum2, peserta_moduls) {
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
                    where: {
                        id: modulId,
                    },
                    select: {
                        id: true,
                        nama_modul: true,
                        penanggung_jawab: true,
                        bobot_nilai_proses: true,
                        penilaian_moduls: true,
                        peserta_moduls: true,
                    },
                });
                if (!existingModul) {
                    throw new Error("Modul not found");
                }
                const existingBobotProses = existingModul.bobot_nilai_proses[0] || {
                    diskusi: 0,
                    buku_catatan: 0,
                    temu_pakar: 0,
                    peta_konsep: 0,
                    proses_praktik: 0,
                    nilai_proses: {},
                };
                if (bobot_nilai_proses_default) {
                    const providedFields = Object.entries(bobot_nilai_proses_default)
                        .filter(([_, nilai]) => nilai !== undefined)
                        .reduce((acc, [key, nilai]) => {
                        acc[key] = Number(nilai) || 0; // Pastikan konversi ke number
                        return acc;
                    }, {});
                    const totalBobotProses = Object.values(providedFields).reduce((sum, nilai) => sum + nilai, 0);
                    if (totalBobotProses > 100) {
                        throw new Error("Total nilai proses tidak boleh lebih dari 100%");
                    }
                }
                if (bobot_nilai_proses && Object.keys(bobot_nilai_proses).length > 0) {
                    const totalDinamis = Object.values(bobot_nilai_proses).reduce((sum, nilai) => sum + (Number(nilai) || 0), 0);
                    if (totalDinamis > 100) {
                        throw new Error("Total nilai dinamis tidak boleh lebih dari 100%");
                    }
                }
                let newPesertaModuls = [];
                let invalidNims = [];
                if (peserta_moduls) {
                    const workbook = XLSX.read(peserta_moduls, { type: "buffer" });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                        header: ["Nim", "Nama"],
                        raw: false, // Pastikan output sebagai string
                    });
                    if (!jsonData[0] || !jsonData[0].Nim || !jsonData[0].Nama) {
                        throw new Error("File Excel harus memiliki kolom 'Nim' dan 'Nama'");
                    }
                    // const nims = jsonData.map((row) => String(row.Nim));
                    // const uniqueNims = [...new Set(nims)]; // Hilangkan duplikat
                    // if (uniqueNims.length !== nims.length) {
                    //   throw new Error("Terdapat NIM duplikat dalam file Excel");
                    // }
                    const mahasiswaList = yield db2_1.default.mda_master_mahasiswa.findMany({
                        select: { nim: true },
                    });
                    const validNims = new Set(mahasiswaList.map((m) => String(m.nim)));
                    const existingPesertaNims = new Set(existingModul.peserta_moduls.map((p) => p.nim));
                    const availableNims = Array.from(validNims).filter((nim) => !existingPesertaNims.has(nim));
                    if (availableNims.length === 0) {
                        throw new Error("Tidak ada Nim baru yang tersedia untuk ditambahkan ke modul ini");
                    }
                    // const mahasiswaNims = new Set(mahasiswaList.map((m) => m.nim));
                    const assignedNims = [];
                    newPesertaModuls = jsonData
                        .map((row, index) => {
                        const excelNim = String(row.Nim); // Konversi ke string
                        const excelNama = String(row.Nama); // Konversi ke string
                        if (!excelNim || !excelNama) {
                            invalidNims.push(`Kosong di baris ${index + 2}`);
                            return null;
                        }
                        // Pilih Nim acak dari daftar valid jika Nim dari Excel tidak ada
                        let assignedNim = excelNim;
                        if (!validNims.has(excelNim)) {
                            const unusedNims = availableNims.filter((nim) => !assignedNims.includes(nim));
                            if (unusedNims.length === 0) {
                                invalidNims.push(`Tidak cukup Nim unik untuk baris ${index + 2}`);
                                return null;
                            }
                            assignedNim =
                                unusedNims[Math.floor(Math.random() * unusedNims.length)];
                            assignedNims.push(assignedNim);
                        }
                        else if (existingPesertaNims.has(assignedNim)) {
                            invalidNims.push(`Nim ${assignedNim} sudah terdaftar di modul ini dibaris ${index + 2}`);
                            return null;
                        }
                        else {
                            assignedNims.push(assignedNim);
                        }
                        return { Nim: assignedNim, Nama: excelNama };
                    })
                        .filter((item) => item !== null);
                    if (invalidNims.length > 0) {
                        throw new Error(`NIM tidak ditemukan di database: ${invalidNims.join(", ")}`);
                    }
                    const newNims = new Set(newPesertaModuls.map((p) => p.Nim));
                    if (newNims.size !== newPesertaModuls.length) {
                        throw new Error("Terjadi duplikat Nim dalam data yang akan dimasukkan");
                    }
                }
                const updateModul = yield db1_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c, _d, _e, _f;
                    // Update modul
                    const modul = yield tx.modul.update({
                        where: { id: modulId },
                        data: {
                            nama_modul: nama_modul !== null && nama_modul !== void 0 ? nama_modul : existingModul.nama_modul,
                            penanggung_jawab: penanggung_jawab !== null && penanggung_jawab !== void 0 ? penanggung_jawab : existingModul.penanggung_jawab,
                        },
                        include: {
                            bobot_nilai_proses: true,
                            penilaian_moduls: true,
                        },
                    });
                    // Update bobot_nilai_proses
                    yield tx.bobotNilaiProses.update({
                        where: { modul_id: modulId },
                        data: {
                            diskusi: (_a = bobot_nilai_proses_default === null || bobot_nilai_proses_default === void 0 ? void 0 : bobot_nilai_proses_default.diskusi) !== null && _a !== void 0 ? _a : existingBobotProses.diskusi,
                            buku_catatan: (_b = bobot_nilai_proses_default === null || bobot_nilai_proses_default === void 0 ? void 0 : bobot_nilai_proses_default.buku_catatan) !== null && _b !== void 0 ? _b : existingBobotProses.buku_catatan,
                            temu_pakar: (_c = bobot_nilai_proses_default === null || bobot_nilai_proses_default === void 0 ? void 0 : bobot_nilai_proses_default.temu_pakar) !== null && _c !== void 0 ? _c : existingBobotProses.temu_pakar,
                            peta_konsep: (_d = bobot_nilai_proses_default === null || bobot_nilai_proses_default === void 0 ? void 0 : bobot_nilai_proses_default.peta_konsep) !== null && _d !== void 0 ? _d : existingBobotProses.peta_konsep,
                            proses_praktik: (_e = bobot_nilai_proses_default === null || bobot_nilai_proses_default === void 0 ? void 0 : bobot_nilai_proses_default.proses_praktik) !== null && _e !== void 0 ? _e : existingBobotProses.proses_praktik,
                            nilai_proses: (_f = bobot_nilai_proses !== null && bobot_nilai_proses !== void 0 ? bobot_nilai_proses : existingBobotProses.nilai_proses) !== null && _f !== void 0 ? _f : {},
                        },
                    });
                    // Update penilaian_modul
                    const penilaian = yield tx.penilaianModul.findFirst({
                        where: { modul_id: modulId },
                    });
                    if (penilaian) {
                        yield tx.penilaianModul.update({
                            where: { id: penilaian.id },
                            data: {
                                total_soal_sum1: total_soal_sum1 !== null && total_soal_sum1 !== void 0 ? total_soal_sum1 : penilaian.total_soal_sum1,
                                total_soal_sum2: total_soal_sum2 !== null && total_soal_sum2 !== void 0 ? total_soal_sum2 : penilaian.total_soal_sum2,
                                total_her_sum1: total_soal_her_sum1 !== null && total_soal_her_sum1 !== void 0 ? total_soal_her_sum1 : penilaian.total_her_sum1,
                                total_her_sum2: total_soal_her_sum2 !== null && total_soal_her_sum2 !== void 0 ? total_soal_her_sum2 : penilaian.total_her_sum2,
                            },
                        });
                    }
                    // Tambah peserta_moduls dari Excel
                    if (newPesertaModuls.length > 0) {
                        yield tx.pesertaModul.createMany({
                            data: newPesertaModuls.map((p) => ({
                                modul_id: modulId,
                                nim: p.Nim,
                            })),
                        });
                    }
                    return modul;
                }));
                return {
                    modul: updateModul,
                    importedPeserta: newPesertaModuls,
                    invalidNims,
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    static getDosenPenanggungJawab(userId, role, search) {
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
                const searchTrem = search && search.trim() ? search.trim() : undefined;
                const dosenList = yield db1_1.default.dosen.findMany({
                    where: Object.assign(Object.assign({ status: "Aktif", role: "Dosen" }, (role === "Dosen" && { id: userId })), (searchTrem && {
                        nama_depan: {
                            contains: searchTrem,
                            mode: "insensitive",
                        },
                    })),
                    select: {
                        id: true,
                        nama_depan: true,
                        created_at: true,
                    },
                });
                const mdaDosenList = yield db2_1.default.mda_master_dosen.findMany({
                    where: Object.assign({}, (searchTrem && {
                        nama_dosen: {
                            contains: searchTrem,
                        },
                    })),
                    select: {
                        id: true,
                        nama_dosen: true,
                        waktu_dibuat: true,
                    },
                });
                const combinedDosen = dosenList.map((dosen) => ({
                    id: dosen.id,
                    nama: dosen.nama_depan || "Nama tidak tersedia",
                    created_at: dosen.created_at,
                }));
                const existingNames = new Set(dosenList.map((d) => { var _a; return (_a = d.nama_depan) === null || _a === void 0 ? void 0 : _a.toLowerCase(); }));
                const additionalDosen = mdaDosenList
                    .filter((mda) => { var _a; return !existingNames.has((_a = mda.nama_dosen) === null || _a === void 0 ? void 0 : _a.toLowerCase()); })
                    .map((mda) => ({
                    id: mda.id,
                    nama: mda.nama_dosen || "Nama tidak tersedia",
                    created_at: mda.waktu_dibuat || new Date(0),
                }));
                const result = [...combinedDosen, ...additionalDosen];
                return result
                    .map(({ id, nama, created_at }) => ({ id, nama, created_at })) // Hanya kembalikan id dan nama
                    .sort((a, b) => {
                    const dateA = new Date(a.created_at).getTime();
                    const dateB = new Date(b.created_at).getTime();
                    return dateB - dateA; // Descending: waktu terbaru di atas
                });
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = ModulServices;
