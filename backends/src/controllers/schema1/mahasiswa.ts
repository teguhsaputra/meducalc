import { Request, Response } from "express";
import MahasiswaServices from "../../services/schema1/mahasiswa";

class MahasiswaControllers {
  static async getMahasiswa(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { page = 1, limit = 10, search = "" } = req.query;

      const result = await MahasiswaServices.getMahasiswa(
        userId,
        role,
        Number(page),
        Number(limit),
        search as string
      );

      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }

  static async getAllMahasiswa(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const {
        page = 1,
        limit = 10,
        searchSiswa = "",
        searchNim = "",
        searchAngkatan = "",
      } = req.query;

      const result = await MahasiswaServices.getAllMahasiswa(
        userId,
        role,
        Number(page),
        Number(limit),
        searchSiswa as string,
        searchNim as string,
        searchAngkatan as string
      );

      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }
  static async getMahasiswaDetailByNim(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { nim } = req.params;

      const result = await MahasiswaServices.getDetailMahasiswaByNim(
        userId,
        role,
        nim as string
      );

      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }
  static async addMahasiswa(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const {
        namaDepan,
        namaBelakang,
        tanggalLahir,
        jenisKelamin,
        nim,
        angkatan,
        username,
        password,
      } = req.body;

      const result = await MahasiswaServices.addMahasiswa(
        userId,
        role,
        namaDepan,
        namaBelakang,
        tanggalLahir,
        jenisKelamin,
        nim,
        angkatan,
        username,
        password
      );

      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }
  static async editMahasiswaById(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { mahasiswaId } = req.params;
      const {
        namaDepan,
        namaBelakang,
        tanggalLahir,
        jenisKelamin,
        nim,
        angkatan,
        username,
      } = req.body;

      await MahasiswaServices.editMahasiswaById(
        userId,
        role,
        Number(mahasiswaId),
        namaDepan,
        namaBelakang,
        tanggalLahir,
        jenisKelamin,
        nim,
        angkatan,
        username
      );

      res.status(200).json({
        status: true,
        message: "Akun berhasil diupdate",
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }
  static async getMahasiswaById(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { mahasiswaId } = req.params;

      const result = await MahasiswaServices.getMahasiswaById(
        userId,
        role,
        Number(mahasiswaId)
      );

      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }

  static async getModulByMahasiswa(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const {
        page = 1,
        limit = 10,
        searchSiswa = "",
        searchTahunAjaran = "",
      } = req.query;

      const result = await MahasiswaServices.getModulMahasiswa(
        userId,
        role,
        Number(page),
        Number(limit),
        searchSiswa as string,
        searchTahunAjaran as string
      );

      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }

  static async getHasilPenilaianByNimMahasiswa(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { nim } = req.params;

      const data = await MahasiswaServices.getHasilPenilaianByNimMahasiswa(
        userId,
        role,
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
}

export default MahasiswaControllers;
