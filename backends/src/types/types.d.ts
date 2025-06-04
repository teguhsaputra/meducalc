export type PenilaianInput = {
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
    Record<string, { praktikum: string; jenisNilai?: string; nilai: string }>
  >;
};
