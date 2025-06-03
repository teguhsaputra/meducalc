-- CreateTable
CREATE TABLE "PenilaianBukuCatatan" (
    "id" SERIAL NOT NULL,
    "peserta_modul_id" INTEGER NOT NULL,
    "label" VARCHAR(10) NOT NULL,
    "nilai" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenilaianBukuCatatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenilaianTemuPakar" (
    "id" SERIAL NOT NULL,
    "peserta_modul_id" INTEGER NOT NULL,
    "label" VARCHAR(10) NOT NULL,
    "nilai" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenilaianTemuPakar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenilaianPetaKonsep" (
    "id" SERIAL NOT NULL,
    "peserta_modul_id" INTEGER NOT NULL,
    "pemicu_id" INTEGER NOT NULL,
    "ilmu" VARCHAR(100) NOT NULL,
    "dokter" VARCHAR(100) NOT NULL,
    "nilai" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenilaianPetaKonsep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenilaianProsesPraktikumDetail" (
    "id" SERIAL NOT NULL,
    "peserta_modul_id" INTEGER NOT NULL,
    "praktikum_id" INTEGER NOT NULL,
    "jenis_nilai" VARCHAR(50) NOT NULL,
    "nilai" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenilaianProsesPraktikumDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PenilaianBukuCatatan_peserta_modul_id_label_key" ON "PenilaianBukuCatatan"("peserta_modul_id", "label");

-- CreateIndex
CREATE UNIQUE INDEX "PenilaianTemuPakar_peserta_modul_id_label_key" ON "PenilaianTemuPakar"("peserta_modul_id", "label");

-- CreateIndex
CREATE UNIQUE INDEX "PenilaianPetaKonsep_peserta_modul_id_pemicu_id_ilmu_key" ON "PenilaianPetaKonsep"("peserta_modul_id", "pemicu_id", "ilmu");

-- CreateIndex
CREATE UNIQUE INDEX "PenilaianProsesPraktikumDetail_peserta_modul_id_praktikum_i_key" ON "PenilaianProsesPraktikumDetail"("peserta_modul_id", "praktikum_id", "jenis_nilai");

-- AddForeignKey
ALTER TABLE "PenilaianBukuCatatan" ADD CONSTRAINT "PenilaianBukuCatatan_peserta_modul_id_fkey" FOREIGN KEY ("peserta_modul_id") REFERENCES "PesertaModul"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenilaianTemuPakar" ADD CONSTRAINT "PenilaianTemuPakar_peserta_modul_id_fkey" FOREIGN KEY ("peserta_modul_id") REFERENCES "PesertaModul"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenilaianPetaKonsep" ADD CONSTRAINT "PenilaianPetaKonsep_peserta_modul_id_fkey" FOREIGN KEY ("peserta_modul_id") REFERENCES "PesertaModul"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenilaianProsesPraktikumDetail" ADD CONSTRAINT "PenilaianProsesPraktikumDetail_peserta_modul_id_fkey" FOREIGN KEY ("peserta_modul_id") REFERENCES "PesertaModul"("id") ON DELETE CASCADE ON UPDATE CASCADE;
