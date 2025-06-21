export type TProfile = {
  id?: string;
  username: string;
  role: string;
  createdAt?: string;
};

export type TPemicus = {
  nomor_pemicu: number;
  ilmuId: number;
  dokterId: number;
};

export type TCreatePemicus = {
  modul_id: number;
  pemicus: TPemicus[];
};

export type TPenilaianProses = {
  praktikum_id: number;
  jenis_nilai_id: number;
  bobot?: number | undefined;
};

export type TAddPenilaianData = {
  modul_id: number;
  total_soal_sum1?: number;
  total_soal_sum2?: number;
  total_soal_her_sum1?: number;
  total_soal_her_sum2?: number;
  penilaianProses: TPenilaianProses[];
};

export type TPeserta = {
  id: string;
  nama_siswa: string;
  nim: number;
  angkatan: number;
  username: string;
};

export type TPenilaianInput = {
  totalBenarSumatif1: number;
  totalBenarSumatif2: number;
  totalBenarHerSumatif1: number;
  totalBenarHerSumatif2: number;
  nilaiPraktikum: Record<string, string>;
  nilaiHerPraktikum: Record<string, string>;
  diskusiKelompokNilai: Record<string, string>;
  catatanNilai: Record<string, string>;
  temuPakarNilai: Record<string, string>;
  petaKonsepNilai: Record<
    string,
    Record<string, { ilmu?: string; dokter?: string; nilai: string }>
  >;
  prosesPraktikumNilai: Record<
    string,
    Record<string, { praktikum?: string; jenisNilai?: string; nilai: string }>
  >;
};

export type TBobotNilaiProsesDefault = {
  diskusi: number;
  buku_catatan: number;
  temu_pakar: number;
  peta_konsep: number;
  proses_praktik: number;
};

export type TBobotNilaiProses = {
  [key: string]: number;
};

export type TEditModul = {
  nama_modul: string;
  penanggung_jawab: string;
  bobot_nilai_akhir: BobotNilaiAkhir;
  bobot_nilai_proses_default: TBobotNilaiProsesDefault;
  bobot_nilai_proses: TBobotNilaiProses;
  total_soal_sum1: number;
  total_soal_sum2: number;
  total_soal_her_sum1: number;
  total_soal_her_sum2: number;
};

export type TPemicu = {
  id: number;
  nomorPemicu: number;
  ilmuNama: string;
  dosenNama: string;
  created_at: string;
  updated_at: string;
};

export type TPenilaianProsesPraktikum = {
  id: number;
  praktikum: Praktikum;
  jenis_nilai: string | null;
  jenis_nilai_id: number;
  jenis_nilai_nama: string;
  bobot: number;
  created_at: string;
  updated_at: string;
};
