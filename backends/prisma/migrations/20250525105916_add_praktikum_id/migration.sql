/*
  Warnings:

  - Added the required column `praktikumId` to the `PenilaianProsesPraktikum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `praktikum_id` to the `PenilaianProsesPraktikum` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PenilaianProsesPraktikum" ADD COLUMN     "praktikumId" INTEGER NOT NULL,
ADD COLUMN     "praktikum_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "PenilaianProsesPraktikum" ADD CONSTRAINT "PenilaianProsesPraktikum_praktikumId_fkey" FOREIGN KEY ("praktikumId") REFERENCES "Praktikum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
