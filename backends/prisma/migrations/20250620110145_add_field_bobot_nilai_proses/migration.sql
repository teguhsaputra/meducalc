-- AlterTable
ALTER TABLE "BobotNilaiAkhir" ALTER COLUMN "nilai_sumatif" DROP NOT NULL,
ALTER COLUMN "nilai_proses" DROP NOT NULL,
ALTER COLUMN "nilai_praktik" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BobotNilaiProses" ADD COLUMN     "nilai_proses" JSONB,
ALTER COLUMN "diskusi" DROP NOT NULL,
ALTER COLUMN "buku_catatan" DROP NOT NULL,
ALTER COLUMN "temu_pakar" DROP NOT NULL,
ALTER COLUMN "peta_konsep" DROP NOT NULL,
ALTER COLUMN "proses_praktik" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PenilaianModul" ALTER COLUMN "total_soal_sum1" DROP NOT NULL,
ALTER COLUMN "total_soal_sum2" DROP NOT NULL,
ALTER COLUMN "total_her_sum1" DROP NOT NULL,
ALTER COLUMN "total_her_sum2" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PenilaianProsesPraktikum" ALTER COLUMN "bobot" DROP NOT NULL;
