import { Request, Response } from "express";
import PenilaianModulServices from "../../services/schema1/penilaian-modul";

class PenilaianModulControllers {
  static async getModulByDosen(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { page = 1, limit = 10, searchModul, searchSchoolYear } = req.query;

      const data = await PenilaianModulServices.getModulForInputPenilaian(
        userId,
        role,
        Number(page),
        Number(limit),
        searchModul as string,
        searchSchoolYear as string
      );

      res.status(200).json({
        status: true,
        data,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }
  static async getModulDetailForInputPenilaian(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { namaModul } = req.params;
      const {
        page = 1,
        limit = 10,
        searchSiswa,
        searchNim,
        searchAngkatan,
      } = req.query;

      const data = await PenilaianModulServices.getModulDetailForInputPenilaian(
        userId,
        role,
        namaModul,
        Number(page),
        Number(limit),
        searchSiswa as string,
        searchNim as string,
        searchAngkatan as string
      );

      res.status(200).json({
        status: true,
        data,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }
  static async getModulByNim(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { namaModul, nim } = req.params;

      const data = await PenilaianModulServices.getModulByNim(
        userId,
        role,
        namaModul,
        nim
      );

      res.status(200).json({
        status: true,
        data,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }
  static async inputPenilaian(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { nim, namaModul } = req.params;
      const { input } = req.body;

      await PenilaianModulServices.InputPenilaian(userId, role, nim, namaModul, input);

      res.status(200).json({
        status: true,
        message: "Berhasil di simpan",
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }

  static async getHasilInputPenilaian(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { namaModul, nim } = req.params;

      const data = await PenilaianModulServices.getHasilInputPenilaian(
        userId,
        role,
        namaModul,
        nim
      );

      res.status(200).json({
        status: true,
        data,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }

  static async getModulDetailHasilPenilaian(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { namaModul } = req.params;
      const {
        page = 1,
        limit = 10,
        searchSiswa,
        searchNim,
        sortOrder = "asc",
        tingkatFilter = "",
      } = req.query;

      const data = await PenilaianModulServices.getModulDetailHasilPenilaian(
        userId,
        role,
        namaModul,
        Number(page),
        Number(limit),
        searchSiswa as string,
        searchNim as string,
        sortOrder as "asc" | "desc",
        tingkatFilter as "A" | "B" | "C" | "D" | "E" | ""
      );

      res.status(200).json({
        status: true,
        data,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }
}

export default PenilaianModulControllers;
