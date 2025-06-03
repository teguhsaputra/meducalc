/*
  Warnings:

  - You are about to drop the column `tahun_ajaran_id` on the `Modul` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal_mulai` on the `Modul` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal_selesai` on the `Modul` table. All the data in the column will be lost.
  - Added the required column `tahun_mulai` to the `Modul` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tahun_selesai` to the `Modul` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Modul" DROP CONSTRAINT "Modul_tahun_ajaran_id_fkey";

-- AlterTable
ALTER TABLE "Modul" DROP COLUMN "tahun_ajaran_id",
DROP COLUMN "tanggal_mulai",
DROP COLUMN "tanggal_selesai",
ADD COLUMN     "tahunAjaranId" INTEGER,
ADD COLUMN     "tahun_mulai" INTEGER NOT NULL,
ADD COLUMN     "tahun_selesai" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Modul" ADD CONSTRAINT "Modul_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES "TahunAjaran"("id") ON DELETE SET NULL ON UPDATE CASCADE;
