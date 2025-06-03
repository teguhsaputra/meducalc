/*
  Warnings:

  - Added the required column `nomor_pemicu` to the `Pemicu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pemicu" ADD COLUMN     "nomor_pemicu" INTEGER NOT NULL;
