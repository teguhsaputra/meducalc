import { Request, Response } from "express";
import PraktikumServices from "../../services/schema1/praktikum";

class PraktikumControllers {
  static async getPraktikum(req: Request, res: Response) {
    try {
      const praktikums = await PraktikumServices.getPraktikum();

      res.status(200).json({
        status: true,
        data: praktikums,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }
  static async getPraktikumByModul(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { modul_id } = req.query;

      const praktikums = await PraktikumServices.getPraktikumByModul(
        userId,
        role,
        Number(modul_id)
      );

      res.status(200).json({
        status: true,
        data: praktikums,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }

  static async getJenisPenilaian(req: Request, res: Response) {
    try {
      const jenisPenilaian = await PraktikumServices.getJenisPenilaian();

      res.status(200).json({
        status: true,
        data: jenisPenilaian,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }
}

export default PraktikumControllers;
