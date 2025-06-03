/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(60) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'Aktif',

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SesiPenilaian" (
    "id" SERIAL NOT NULL,
    "sesi_mulai" DATE NOT NULL,
    "sesi_selesai" DATE NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'Aktif',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SesiPenilaian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TahunAjaran" (
    "id" SERIAL NOT NULL,
    "tahun_ajaran" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TahunAjaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dosen" (
    "id" SERIAL NOT NULL,
    "nama_depan" VARCHAR(50) NOT NULL,
    "tanggal_lahir" DATE NOT NULL,
    "username" VARCHAR(60) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dosen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mahasiswa" (
    "id" SERIAL NOT NULL,
    "nama_depan" VARCHAR(50) NOT NULL,
    "nama_belakang" VARCHAR(50) NOT NULL,
    "tanggal_lahir" DATE NOT NULL,
    "jenis_kelamin" VARCHAR(20) NOT NULL,
    "nim" VARCHAR(15) NOT NULL,
    "angkatan" INTEGER NOT NULL,
    "username" VARCHAR(60) NOT NULL,
    "password" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mahasiswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Modul" (
    "id" SERIAL NOT NULL,
    "nama_modul" VARCHAR(100) NOT NULL,
    "tahun_ajaran_id" INTEGER NOT NULL,
    "penanggung_jawab_id" INTEGER NOT NULL,
    "tanggal_mulai" DATE NOT NULL,
    "tanggal_selesai" DATE NOT NULL,
    "total_siswa" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Modul_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BobotNilaiAkhir" (
    "id" SERIAL NOT NULL,
    "modul_id" INTEGER NOT NULL,
    "nilai_sumatif" DECIMAL(5,2) NOT NULL,
    "nilai_proses" DECIMAL(5,2) NOT NULL,
    "nilai_praktik" DECIMAL(5,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BobotNilaiAkhir_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BobotNilaiProses" (
    "id" SERIAL NOT NULL,
    "modul_id" INTEGER NOT NULL,
    "diskusi" DECIMAL(5,2) NOT NULL,
    "buku_catatan" DECIMAL(5,2) NOT NULL,
    "temu_pakar" DECIMAL(5,2) NOT NULL,
    "peta_konsep" DECIMAL(5,2) NOT NULL,
    "proses_praktik" DECIMAL(5,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BobotNilaiProses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Praktikum" (
    "id" SERIAL NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Praktikum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModulPraktikum" (
    "id" SERIAL NOT NULL,
    "modul_id" INTEGER NOT NULL,
    "praktikum_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModulPraktikum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ilmu" (
    "id" SERIAL NOT NULL,
    "nama_ilmu" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ilmu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pemicu" (
    "id" SERIAL NOT NULL,
    "modul_id" INTEGER NOT NULL,
    "ilmu_id" INTEGER NOT NULL,
    "dosen_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pemicu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenilaianModul" (
    "id" SERIAL NOT NULL,
    "modul_id" INTEGER NOT NULL,
    "total_soal_sum1" INTEGER NOT NULL DEFAULT 0,
    "total_soal_sum2" INTEGER NOT NULL DEFAULT 0,
    "total_her_sum1" INTEGER NOT NULL DEFAULT 0,
    "total_her_sum2" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenilaianModul_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenilaianProsesPraktikum" (
    "id" SERIAL NOT NULL,
    "penilaian_modul_id" INTEGER NOT NULL,
    "nama_praktikum" VARCHAR(100) NOT NULL,
    "jenis_nilai" VARCHAR(50) NOT NULL,
    "bobot" DECIMAL(5,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenilaianProsesPraktikum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PesertaModul" (
    "id" SERIAL NOT NULL,
    "modul_id" INTEGER NOT NULL,
    "mahasiswa_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PesertaModul_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kelompok" (
    "id" SERIAL NOT NULL,
    "modul_id" INTEGER NOT NULL,
    "nama_kelompok" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kelompok_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KelompokAnggota" (
    "id" SERIAL NOT NULL,
    "kelompok_id" INTEGER NOT NULL,
    "peserta_modul_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KelompokAnggota_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "TahunAjaran_tahun_ajaran_key" ON "TahunAjaran"("tahun_ajaran");

-- CreateIndex
CREATE UNIQUE INDEX "Dosen_username_key" ON "Dosen"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Mahasiswa_nim_key" ON "Mahasiswa"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "Mahasiswa_username_key" ON "Mahasiswa"("username");

-- CreateIndex
CREATE UNIQUE INDEX "BobotNilaiAkhir_modul_id_key" ON "BobotNilaiAkhir"("modul_id");

-- CreateIndex
CREATE UNIQUE INDEX "BobotNilaiProses_modul_id_key" ON "BobotNilaiProses"("modul_id");

-- CreateIndex
CREATE UNIQUE INDEX "ModulPraktikum_modul_id_praktikum_id_key" ON "ModulPraktikum"("modul_id", "praktikum_id");

-- CreateIndex
CREATE UNIQUE INDEX "PesertaModul_modul_id_mahasiswa_id_key" ON "PesertaModul"("modul_id", "mahasiswa_id");

-- CreateIndex
CREATE UNIQUE INDEX "KelompokAnggota_kelompok_id_peserta_modul_id_key" ON "KelompokAnggota"("kelompok_id", "peserta_modul_id");

-- AddForeignKey
ALTER TABLE "Modul" ADD CONSTRAINT "Modul_tahun_ajaran_id_fkey" FOREIGN KEY ("tahun_ajaran_id") REFERENCES "TahunAjaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Modul" ADD CONSTRAINT "Modul_penanggung_jawab_id_fkey" FOREIGN KEY ("penanggung_jawab_id") REFERENCES "Dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BobotNilaiAkhir" ADD CONSTRAINT "BobotNilaiAkhir_modul_id_fkey" FOREIGN KEY ("modul_id") REFERENCES "Modul"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BobotNilaiProses" ADD CONSTRAINT "BobotNilaiProses_modul_id_fkey" FOREIGN KEY ("modul_id") REFERENCES "Modul"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModulPraktikum" ADD CONSTRAINT "ModulPraktikum_modul_id_fkey" FOREIGN KEY ("modul_id") REFERENCES "Modul"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModulPraktikum" ADD CONSTRAINT "ModulPraktikum_praktikum_id_fkey" FOREIGN KEY ("praktikum_id") REFERENCES "Praktikum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pemicu" ADD CONSTRAINT "Pemicu_modul_id_fkey" FOREIGN KEY ("modul_id") REFERENCES "Modul"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pemicu" ADD CONSTRAINT "Pemicu_ilmu_id_fkey" FOREIGN KEY ("ilmu_id") REFERENCES "Ilmu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pemicu" ADD CONSTRAINT "Pemicu_dosen_id_fkey" FOREIGN KEY ("dosen_id") REFERENCES "Dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenilaianModul" ADD CONSTRAINT "PenilaianModul_modul_id_fkey" FOREIGN KEY ("modul_id") REFERENCES "Modul"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenilaianProsesPraktikum" ADD CONSTRAINT "PenilaianProsesPraktikum_penilaian_modul_id_fkey" FOREIGN KEY ("penilaian_modul_id") REFERENCES "PenilaianModul"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PesertaModul" ADD CONSTRAINT "PesertaModul_modul_id_fkey" FOREIGN KEY ("modul_id") REFERENCES "Modul"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PesertaModul" ADD CONSTRAINT "PesertaModul_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "Mahasiswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kelompok" ADD CONSTRAINT "Kelompok_modul_id_fkey" FOREIGN KEY ("modul_id") REFERENCES "Modul"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KelompokAnggota" ADD CONSTRAINT "KelompokAnggota_kelompok_id_fkey" FOREIGN KEY ("kelompok_id") REFERENCES "Kelompok"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KelompokAnggota" ADD CONSTRAINT "KelompokAnggota_peserta_modul_id_fkey" FOREIGN KEY ("peserta_modul_id") REFERENCES "PesertaModul"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
