import { Request, Response } from "express";
import DosenServices from "../../services/schema1/dosen";

class DosenControllers {
  static async getIlmuAndDosen(req: Request, res: Response) {
    try {
      const data = await DosenServices.getIlmuAndDosen();

      res.status(200).json({
        status: true,
        data,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }
  static async getDosenModul(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { page = 1, pageSize = 10, search = "" } = req.query;

      const data = await DosenServices.getDosenModul(
        userId,
        role,
        Number(page),
        Number(pageSize),
        search as string
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
  static async getModulByDosen(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const {
        page = 1,
        limit = 10,
        search = "",
        penanggungJawab,
        searchModul,
        searchSchoolYear,
      } = req.query;

      const data = await DosenServices.getModulByDosen(
        userId,
        role,
        Number(page),
        Number(limit),
        searchModul as string,
        searchSchoolYear as string,
        penanggungJawab as string
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

  static async addDosen(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { namaDepan, tanggalLahir, username, password } = req.body;

      const data = await DosenServices.addDosen(
        userId,
        role,
        namaDepan,
        tanggalLahir,
        username,
        password
      );

      res.status(201).json({
        status: true,
        data,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  static async getModulDosen(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { page = 1, limit = 10, searchModul, searchSchoolYear } = req.query;

      const data = await DosenServices.getModulDosen(
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

  static async getModulDosenDetailHasilPenilaian(req: Request, res: Response) {
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

      const data = await DosenServices.getModulDosenDetailHasilPenilaian(
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

export default DosenControllers;
