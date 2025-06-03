/*
  Warnings:

  - You are about to drop the column `email` on the `Dosen` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Dosen" DROP COLUMN "email",
ALTER COLUMN "nama_depan" DROP NOT NULL,
ALTER COLUMN "tanggal_lahir" DROP NOT NULL,
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "mda_dosen_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Mahasiswa" ALTER COLUMN "nama_depan" DROP NOT NULL,
ALTER COLUMN "nama_belakang" DROP NOT NULL,
ALTER COLUMN "tanggal_lahir" DROP NOT NULL,
ALTER COLUMN "jenis_kelamin" DROP NOT NULL,
ALTER COLUMN "nim" DROP NOT NULL,
ALTER COLUMN "angkatan" DROP NOT NULL,
ALTER COLUMN "username" DROP NOT NULL;
