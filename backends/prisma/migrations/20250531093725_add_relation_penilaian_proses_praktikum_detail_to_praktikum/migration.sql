-- AddForeignKey
ALTER TABLE "PenilaianProsesPraktikumDetail" ADD CONSTRAINT "PenilaianProsesPraktikumDetail_praktikum_id_fkey" FOREIGN KEY ("praktikum_id") REFERENCES "Praktikum"("id") ON DELETE CASCADE ON UPDATE CASCADE;
