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
const auth_1 = __importDefault(require("../../services/schema1/auth"));
class AuthController {
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                const data = yield auth_1.default.login(username, password);
                const expiredIn = 3600;
                res.status(200).json({
                    success: true,
                    data,
                    token_type: "Bearer",
                    epxires_in: expiredIn,
                });
            }
            catch (error) {
                const err = error;
                res.status(500).json({ message: err.message, status: false });
            }
        });
    }
    static getMe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = res.locals.user;
                const data = yield auth_1.default.getMe(userId, role);
                res.status(200).json({
                    success: true,
                    data,
                });
            }
            catch (error) {
                const err = error;
                res.status(401).json({ message: err.message, status: false });
            }
        });
    }
}
exports.default = AuthController;
