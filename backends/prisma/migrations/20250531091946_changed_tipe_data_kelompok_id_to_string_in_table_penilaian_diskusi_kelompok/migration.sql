/*
  Warnings:

  - You are about to alter the column `kelompok_id` on the `PenilaianDiskusiKelompok` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(10)`.

*/
-- AlterTable
ALTER TABLE "PenilaianDiskusiKelompok" ALTER COLUMN "kelompok_id" SET DATA TYPE VARCHAR(10);
