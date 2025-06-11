import { Request, Response } from "express";
import ModulServices from "../../services/schema1/modul";

class ModulControllers {
  static async getModul(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const {
        page = 1,
        limit = 10,
        search = "",
        fetchAll = "false",
      } = req.query;

      const data = await ModulServices.getModul(
        Number(page),
        Number(limit),
        search as string,
        userId,
        role,
        fetchAll === "true"
      );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  static async addModul(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const {
        nama_modul,
        tahun_mulai,
        tahun_selesai,
        penanggung_jawab,
        bobot_nilai_akhir,
        bobot_nilai_proses,
        praktikum_id,
      } = req.body;

      const newModul = await ModulServices.createModul(
        nama_modul,
        tahun_mulai,
        tahun_selesai,
        penanggung_jawab,
        bobot_nilai_akhir,
        bobot_nilai_proses,
        praktikum_id,
        userId,
        role
      );

      res.status(200).json({
        success: true,
        data: newModul,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  static async addPemicu(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { modul_id, pemicus } = req.body;

      const newPemicu = await ModulServices.addPemicu(
        userId,
        role,
        modul_id,
        pemicus
      );

      res.status(200).json({
        success: true,
        data: newPemicu,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }
  static async addPenilaianModul(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const {
        modul_id,
        total_soal_sum1,
        total_soal_sum2,
        total_soal_her_sum1,
        total_soal_her_sum2,
        penilaianProses,
      } = req.body;

      const newPemicu = await ModulServices.addPenilaianModul(
        userId,
        role,
        modul_id,
        total_soal_sum1,
        total_soal_sum2,
        total_soal_her_sum1,
        total_soal_her_sum2,
        penilaianProses
      );

      res.status(200).json({
        success: true,
        data: newPemicu,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  static async addPeserta(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { modul_id, mahasiswaId } = req.body;

      await ModulServices.addPeserta(userId, role, modul_id, mahasiswaId);
      res.status(201).json({
        success: true,
        message: `Tambah peserta di modul id ${modul_id} berhasil`,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }

  static async createKelompok(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { modul_id } = req.body;

      await ModulServices.createKelompok(userId, role, modul_id);

      res.status(201).json({
        success: true,
        message: `Kelompok berhasil dibuat`,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }
  static async deleteKelompok(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { modul_id, kelompokId } = req.body;

      await ModulServices.deleteKelompok(userId, role, modul_id, kelompokId);

      res.status(200).json({
        success: true,
        message: `Kelompok berhasil dihapus`,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }
  static async addPesertaToKelompok(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { modul_id, kelompokId, nims } = req.body;

      await ModulServices.addPesertaToKelompok(
        userId,
        role,
        modul_id,
        kelompokId,
        nims
      );

      res.status(200).json({
        success: true,
        message: `Peserta Id ${nims} berhasil ditambah ke kelompok ${kelompokId}`,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }

  static async deletePesertaFromKelompok(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { kelompokAnggotaId } = req.body;

      await ModulServices.deletePesertaFromKelompok(
        userId,
        role,
        kelompokAnggotaId
      );

      res.status(200).json({
        success: true,
        message: `Peserta Kelompok berhasil dihapus`,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }

  static async getModulById(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { modul_id } = req.params;

      const result = await ModulServices.getModulById(
        userId,
        role,
        Number(modul_id)
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }
  static async deleteModul(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { modulId } = req.params;

      await ModulServices.deleteModul(userId, role, Number(modulId));

      res.status(200).json({
        success: true,
        message: "Modul Berhasil dihapus",
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }
  static async updateModul(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const { modulId } = req.params;
      const {
        nama_modul,
        penanggung_jawab,
        bobot_nilai_proses,
        total_soal_sum1,
        total_soal_sum2,
        total_soal_her_sum1,
        total_soal_her_sum2,
      } = req.body;

      await ModulServices.updateModul(
        userId,
        role,
        Number(modulId),
        nama_modul,
        penanggung_jawab,
        bobot_nilai_proses,
        total_soal_sum1,
        total_soal_sum2,
        total_soal_her_sum1,
        total_soal_her_sum2
      );

      res.status(200).json({
        success: true,
        message: "Modul Berhasil diedit",
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, status: false });
    }
  }

  static async getDosenPenanggungJawab(req: Request, res: Response) {
    try {
      const { userId, role } = res.locals.user;
      const {search} = req.query

      const result = await ModulServices.getDosenPenanggungJawab(userId, role, search as string);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;

      res.status(400).json({ message: err.message, status: false });
    }
  }
}

export default ModulControllers;
