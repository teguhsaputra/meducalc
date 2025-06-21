"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = uploadMiddleware;
const multer_1 = __importDefault(require("multer"));
function uploadMiddleware() {
    return (0, multer_1.default)({
        storage: multer_1.default.memoryStorage(),
        limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB
        fileFilter: (req, file, cb) => {
            if (file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                cb(null, true);
            }
            else {
                cb(new Error("File harus berupa Excel (.xlsx)"));
            }
        },
    });
}
