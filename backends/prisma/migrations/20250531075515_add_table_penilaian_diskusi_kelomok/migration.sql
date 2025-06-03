-- CreateTable
CREATE TABLE "PenilaianDiskusiKelompok" (
    "id" SERIAL NOT NULL,
    "peserta_modul_id" INTEGER NOT NULL,
    "kelompok_id" INTEGER NOT NULL,
    "pemicu_id" INTEGER NOT NULL,
    "nilai" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenilaianDiskusiKelompok_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PenilaianDiskusiKelompok_peserta_modul_id_kelompok_id_pemic_key" ON "PenilaianDiskusiKelompok"("peserta_modul_id", "kelompok_id", "pemicu_id");

-- AddForeignKey
ALTER TABLE "PenilaianDiskusiKelompok" ADD CONSTRAINT "PenilaianDiskusiKelompok_peserta_modul_id_fkey" FOREIGN KEY ("peserta_modul_id") REFERENCES "PesertaModul"("id") ON DELETE CASCADE ON UPDATE CASCADE;
