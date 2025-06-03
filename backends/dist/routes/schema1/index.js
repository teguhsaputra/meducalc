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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const auth_1 = __importDefault(require("./auth"));
const modul_1 = __importDefault(require("./modul"));
const mahasiswa_1 = __importDefault(require("./mahasiswa"));
const praktikum_1 = __importDefault(require("./praktikum"));
const dosen_1 = __importDefault(require("./dosen"));
const kelompok_1 = __importDefault(require("./kelompok"));
const penilaian_modul_1 = __importDefault(require("./penilaian-modul"));
const route = express.Router();
route.use("/", auth_1.default);
route.use("/", modul_1.default);
route.use("/", mahasiswa_1.default);
route.use("/", praktikum_1.default);
route.use("/", dosen_1.default);
route.use("/", kelompok_1.default);
route.use("/", penilaian_modul_1.default);
// route.use("/", useModuleRoute);
// route.use("/", usePemicuRoute);
exports.default = route;
