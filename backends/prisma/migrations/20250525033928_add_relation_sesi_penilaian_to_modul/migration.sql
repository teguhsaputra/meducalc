-- AlterTable
ALTER TABLE "SesiPenilaian" ADD COLUMN     "modul_id" INTEGER;

-- AddForeignKey
ALTER TABLE "SesiPenilaian" ADD CONSTRAINT "SesiPenilaian_modul_id_fkey" FOREIGN KEY ("modul_id") REFERENCES "Modul"("id") ON DELETE CASCADE ON UPDATE CASCADE;
