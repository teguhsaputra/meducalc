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
  bobot: number | undefined;
};

export type TAddPenilaianData = {
  modul_id: number;
  total_soal_sum1: number;
  total_soal_sum2: number;
  total_soal_her_sum1: number;
  total_soal_her_sum2: number;
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
