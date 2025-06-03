/*
  Warnings:

  - You are about to drop the column `penanggung_jawab_id` on the `Modul` table. All the data in the column will be lost.
  - Added the required column `penanggung_jawab` to the `Modul` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Modul" DROP CONSTRAINT "Modul_penanggung_jawab_id_fkey";

-- AlterTable
ALTER TABLE "Modul" DROP COLUMN "penanggung_jawab_id",
ADD COLUMN     "dosenId" INTEGER,
ADD COLUMN     "penanggung_jawab" VARCHAR(100) NOT NULL;

-- AddForeignKey
ALTER TABLE "Modul" ADD CONSTRAINT "Modul_dosenId_fkey" FOREIGN KEY ("dosenId") REFERENCES "Dosen"("id") ON DELETE SET NULL ON UPDATE CASCADE;
