/*
  Warnings:

  - You are about to drop the column `mahasiswa_id` on the `PesertaModul` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[modul_id,nim]` on the table `PesertaModul` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nim` to the `PesertaModul` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PesertaModul" DROP CONSTRAINT "PesertaModul_mahasiswa_id_fkey";

-- DropIndex
DROP INDEX "PesertaModul_modul_id_mahasiswa_id_key";

-- AlterTable
ALTER TABLE "PesertaModul" DROP COLUMN "mahasiswa_id",
ADD COLUMN     "mahasiswaId" INTEGER,
ADD COLUMN     "nim" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PesertaModul_modul_id_nim_key" ON "PesertaModul"("modul_id", "nim");

-- AddForeignKey
ALTER TABLE "PesertaModul" ADD CONSTRAINT "PesertaModul_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "Mahasiswa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
