"use client";

import { Separator } from "@/components/ui/separator";
import NimDetailHasil from "@/features/admin/hasil-penilaian/slug-listing-hasil/nim-detail-hasil/nim-detail-hasil";
import { withAuth } from "@/hooks/with-auth";
import { useGetHasilInputPenilaian } from "@/services/api/hasil-penilaian";
import React from "react";

type PageProps = { params: { slug: string; nim: string } };

const Page = ({ params }: PageProps) => {
  const namaModul = decodeURIComponent(params.slug);
  const { data, isPending } = useGetHasilInputPenilaian(namaModul, params.nim);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div>
          <span className="text-3xl font-semibold">Penilaian Modul</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
          <div className="flex flex-col">
            <span className="text-sm">Nama</span>
            <span className="text-sm font-bold">{data?.data.nama_siswa}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm">NIM</span>
            <span className="text-sm font-bold">{params.nim}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm">Kelompok</span>
            <span className="text-sm font-bold">
              {data?.data.kelompok_nomor}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm">Nilai Akhir Modul</span>
            <span className="text-sm font-bold">
              {data?.data.nilaiAkhir?.nilai}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm">Tingkat</span>
            <span className="text-sm font-bold">
              {data?.data.nilaiAkhir?.tingkat}
            </span>
          </div>
        </div>
      </div>

      <Separator className="h-0.5 rounded-full my-6" />

      <div>
        <NimDetailHasil
          modul={data?.data.modul}
          inputPenilaian={data?.data.inputPenilaian}
          nilaiSumatif={data?.data.nilaiSumatif}
          nilaiProses={data?.data.nilaiProses}
          nilaiPraktikum={data?.data.nilaiPraktikum}
        />
      </div>
    </div>
  );
};

export default withAuth(Page);
