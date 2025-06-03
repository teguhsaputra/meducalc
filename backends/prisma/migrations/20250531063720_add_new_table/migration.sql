-- CreateTable
CREATE TABLE "PenilaianSumatif" (
    "id" SERIAL NOT NULL,
    "peserta_modul_id" INTEGER NOT NULL,
    "total_benar_sum1" INTEGER NOT NULL,
    "total_benar_sum2" INTEGER NOT NULL,
    "total_benar_her_sum1" INTEGER,
    "total_benar_her_sum2" INTEGER,
    "nilai_akhir" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenilaianSumatif_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenilaianPraktikum" (
    "id" SERIAL NOT NULL,
    "peserta_modul_id" INTEGER NOT NULL,
    "praktikum_id" INTEGER NOT NULL,
    "nilai" DOUBLE PRECISION NOT NULL,
    "nilai_her" DOUBLE PRECISION NOT NULL,
    "nilai_akhir" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenilaianPraktikum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenilaianProses" (
    "id" SERIAL NOT NULL,
    "peserta_modul_id" INTEGER NOT NULL,
    "diskusi_kelompok" DOUBLE PRECISION NOT NULL,
    "buku_catatan" DOUBLE PRECISION NOT NULL,
    "temu_pakar" DOUBLE PRECISION NOT NULL,
    "peta_konsep" DOUBLE PRECISION NOT NULL,
    "proses_praktikum" DOUBLE PRECISION NOT NULL,
    "nilai_akhir" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenilaianProses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenilaianAkhir" (
    "id" SERIAL NOT NULL,
    "peserta_modul_id" INTEGER NOT NULL,
    "nilai_sumatif" DOUBLE PRECISION NOT NULL,
    "nilai_proses" DOUBLE PRECISION NOT NULL,
    "nilai_praktikum" DOUBLE PRECISION NOT NULL,
    "nilai_akhir" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenilaianAkhir_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PenilaianSumatif_peserta_modul_id_key" ON "PenilaianSumatif"("peserta_modul_id");

-- CreateIndex
CREATE UNIQUE INDEX "PenilaianPraktikum_peserta_modul_id_praktikum_id_key" ON "PenilaianPraktikum"("peserta_modul_id", "praktikum_id");

-- CreateIndex
CREATE UNIQUE INDEX "PenilaianProses_peserta_modul_id_key" ON "PenilaianProses"("peserta_modul_id");

-- CreateIndex
CREATE UNIQUE INDEX "PenilaianAkhir_peserta_modul_id_key" ON "PenilaianAkhir"("peserta_modul_id");

-- AddForeignKey
ALTER TABLE "PenilaianSumatif" ADD CONSTRAINT "PenilaianSumatif_peserta_modul_id_fkey" FOREIGN KEY ("peserta_modul_id") REFERENCES "PesertaModul"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenilaianPraktikum" ADD CONSTRAINT "PenilaianPraktikum_peserta_modul_id_fkey" FOREIGN KEY ("peserta_modul_id") REFERENCES "PesertaModul"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenilaianPraktikum" ADD CONSTRAINT "PenilaianPraktikum_praktikum_id_fkey" FOREIGN KEY ("praktikum_id") REFERENCES "Praktikum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenilaianProses" ADD CONSTRAINT "PenilaianProses_peserta_modul_id_fkey" FOREIGN KEY ("peserta_modul_id") REFERENCES "PesertaModul"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenilaianAkhir" ADD CONSTRAINT "PenilaianAkhir_peserta_modul_id_fkey" FOREIGN KEY ("peserta_modul_id") REFERENCES "PesertaModul"("id") ON DELETE CASCADE ON UPDATE CASCADE;
