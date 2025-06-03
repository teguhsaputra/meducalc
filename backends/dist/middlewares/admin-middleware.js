"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = authenticateUser;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authenticateUser(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                status: false,
                message: "No token provided or invalid format",
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({
                status: false,
                message: "Unauthorized",
            });
            return;
        }
        const secretKey = process.env.SECRET_KEY;
        if (!secretKey) {
            throw new Error("SECRET_KEY is not defined in environment variables");
        }
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        if (!decoded.id || !decoded.role) {
            res.status(403).json({
                status: false,
                message: "Invalid token payload",
            });
            return;
        }
        const validRoles = [
            "admin",
            "mahasiswa",
            "dosen",
            "set_user_mahasiswa",
            "set_user_dosen",
        ];
        if (!validRoles.includes(decoded.role)) {
            res.status(403).json({
                status: false,
                message: "Invalid user role",
            });
            return;
        }
        res.locals.user = {
            userId: decoded.id,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({
                status: false,
                message: "Token has expired",
            });
            return;
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({
                status: false,
                message: "Invalid token",
            });
            return;
        }
        res.status(500).json({
            status: false,
            message: "Internal server error during authentication",
        });
        return;
    }
}
