/*
  Warnings:

  - The `jenis_kelamin` column on the `Mahasiswa` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('Pria', 'Perempuan');

-- AlterTable
ALTER TABLE "Mahasiswa" DROP COLUMN "jenis_kelamin",
ADD COLUMN     "jenis_kelamin" "JenisKelamin";
