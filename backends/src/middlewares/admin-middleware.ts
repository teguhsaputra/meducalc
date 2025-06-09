import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Request interface to include user property
type AuthMiddlewareUser = {
  id: number;
  role: string;
};

export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
): void {
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

    const decoded = jwt.verify(token, secretKey) as AuthMiddlewareUser;

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
      "koordinator",
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
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        status: false,
        message: "Token has expired",
      });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
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