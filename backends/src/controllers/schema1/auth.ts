import { Request, Response } from "express";
import AuthServices from "../../services/schema1/auth";

class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const data = await AuthServices.login(username, password);
      const expiredIn = 3600;

      res.status(200).json({
        success: true,
        data,
        token_type: "Bearer",
        epxires_in: expiredIn,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  static async getMe(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;

      const data = await AuthServices.getMe(userId, role);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(401).json({ message: err.message, status: false });
    }
  }
}

export default AuthController;
