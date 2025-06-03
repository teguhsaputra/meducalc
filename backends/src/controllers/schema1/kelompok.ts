import { Request, Response } from "express";
import KelompokServices from "../../services/schema1/kelompok";

class KelompokControllers {
  static async getKelompokByModul(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { modul_id } = req.query;

      const kelompoks = await KelompokServices.getKelompokByModul(
        userId,
        role,
        Number(modul_id)
      );

      res.status(200).json({
        status: true,
        data: kelompoks,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }
  static async getPesertaByModul(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { modul_id } = req.query;

      const peserta = await KelompokServices.getPesertaByModul(
        userId,
        role,
        Number(modul_id)
      );

      res.status(200).json({
        status: true,
        data: peserta,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }
  static async getKelompokAnggota(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { modul_id } = req.query;

      const peserta = await KelompokServices.getKelompokAnggota(
        userId,
        role,
        Number(modul_id)
      );

      res.status(200).json({
        status: true,
        data: peserta,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }
}

export default KelompokControllers;
