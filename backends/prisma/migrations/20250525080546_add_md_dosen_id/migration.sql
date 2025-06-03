/*
  Warnings:

  - A unique constraint covering the columns `[mda_dosen_id]` on the table `Dosen` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mda_dosen_id` to the `Dosen` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Pemicu" DROP CONSTRAINT "Pemicu_dosen_id_fkey";

-- AlterTable
ALTER TABLE "Dosen" ADD COLUMN     "mda_dosen_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Pemicu" ADD COLUMN     "dosenId" INTEGER,
ALTER COLUMN "dosen_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Dosen_mda_dosen_id_key" ON "Dosen"("mda_dosen_id");

-- AddForeignKey
ALTER TABLE "Pemicu" ADD CONSTRAINT "Pemicu_dosenId_fkey" FOREIGN KEY ("dosenId") REFERENCES "Dosen"("id") ON DELETE SET NULL ON UPDATE CASCADE;
