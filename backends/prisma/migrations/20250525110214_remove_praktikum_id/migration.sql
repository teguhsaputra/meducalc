/*
  Warnings:

  - You are about to drop the column `praktikumId` on the `PenilaianProsesPraktikum` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PenilaianProsesPraktikum" DROP CONSTRAINT "PenilaianProsesPraktikum_praktikumId_fkey";

-- AlterTable
ALTER TABLE "PenilaianProsesPraktikum" DROP COLUMN "praktikumId";

-- AddForeignKey
ALTER TABLE "PenilaianProsesPraktikum" ADD CONSTRAINT "PenilaianProsesPraktikum_praktikum_id_fkey" FOREIGN KEY ("praktikum_id") REFERENCES "Praktikum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
