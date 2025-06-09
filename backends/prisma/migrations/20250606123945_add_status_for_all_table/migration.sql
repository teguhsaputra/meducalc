-- CreateEnum
CREATE TYPE "RoleDosen" AS ENUM ('Koordinator', 'Dosen');

-- AlterTable
ALTER TABLE "BobotNilaiAkhir" ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'Aktif';

-- AlterTable
ALTER TABLE "BobotNilaiProses" ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'Aktif';

-- AlterTable
ALTER TABLE "Dosen" ADD COLUMN     "role" "RoleDosen" NOT NULL DEFAULT 'Dosen',
ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'Aktif';

-- AlterTable
ALTER TABLE "Ilmu" ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'Aktif';

-- AlterTable
ALTER TABLE "Kelompok" ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'Aktif';

-- AlterTable
ALTER TABLE "KelompokAnggota" ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'Aktif';

-- AlterTable
ALTER TABLE "Mahasiswa" ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'Aktif';

-- AlterTable
ALTER TABLE "Modul" ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'Aktif';

-- AlterTable
ALTER TABLE "ModulPraktikum" ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'Aktif';

-- AlterTable
ALTER TABLE "Pemicu" ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'Aktif';

-- AlterTable
ALTER TABLE "PenilaianAkhir" ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'Aktif';

-- AlterTable
ALTER TABLE "PenilaianBukuCatatan" ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'Aktif';

-- AlterTable
ALTER TABLE "PenilaianDiskusiKelompok" ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'Aktif';

-- AlterTable
ALTER TABLE "PenilaianModul" ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'Aktif';

-- AlterTable
ALTER TABLE "PenilaianPetaKonsep" ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'Aktif';

-- AlterTable
ALTER TABLE "PenilaianPraktikum" ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'Aktif';

-- AlterTable
ALTER TABLE "PenilaianProses" ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'Aktif';

-- AlterTable
ALTER TABLE "PenilaianProsesPraktikum" ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'Aktif';

-- AlterTable
ALTER TABLE "PenilaianProsesPraktikumDetail" ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'Aktif';

-- AlterTable
ALTER TABLE "PenilaianSumatif" ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'Aktif';

-- AlterTable
ALTER TABLE "PenilaianTemuPakar" ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'Aktif';

-- AlterTable
ALTER TABLE "PesertaModul" ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'Aktif';

-- AlterTable
ALTER TABLE "Praktikum" ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'Aktif';
