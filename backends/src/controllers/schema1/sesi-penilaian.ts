import { Request, Response } from "express";
import SesiPenilaianServices from "../../services/schema1/sesi-penilaian";

class SesiPenilaianControllers {
  static async sesiPenilaian(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { action, sesiMulai, sesiSelesai } = req.body;

      const result = await SesiPenilaianServices.sesiPenilaian(
        userId,
        role,
        action,
        sesiMulai,
        sesiSelesai
      );
      res.status(200).json({
        message: result.message,
        data: result.data || null,
        isActive: result.isActive ?? null,
        status: true,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }

  static async getSesiPenilaian(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user; 

      const result = await SesiPenilaianServices.getSesiPenilaian(userId, role);

      res.status(200).json({
        message: result.message,
        status: result.status,
        sesiMulai: result.sesiMulai,
        sesiSelesai: result.sesiSelesai,
        isActive: result.isActive,
        data: result.data,
        statusCode: true,
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ message: err.message, statusCode: false });
    }
  }
}

export default SesiPenilaianControllers;
