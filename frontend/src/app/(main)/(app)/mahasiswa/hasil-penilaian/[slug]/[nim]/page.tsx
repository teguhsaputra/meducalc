"use client";

import { Separator } from "@/components/ui/separator";
import NimDetailHasilPenilaianMahasiswa from "@/features/mahasiswa/mahasiswa/hasil-penilaian/hasil-penilaian-mahasiswa";
import { withAuth } from "@/hooks/with-auth";
import { useGetHasilPenilaianByNimMahasiswa } from "@/services/api/mahasiswa";
import React from "react";

type PageProps = { params: { slug: string; nim: string } };
const Page = ({ params }: PageProps) => {
  const namaModul = decodeURIComponent(params.slug);

  const { data } = useGetHasilPenilaianByNimMahasiswa(namaModul, params.nim);
  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
        <div>
          <span className="text-2xl md:text-3xl font-semibold block">
            Rangkuman Nilai {data?.data.modul}
          </span>
        </div>

        <div className="flex flex-col md:flex-row  gap-4 ">
          <div className="flex flex-col min-w-[120px]">
            <span className="text-sm text-gray-500">Nama</span>
            <span className="text-sm font-bold">{data?.data.nama_siswa}</span>
          </div>
          <div className="flex flex-col min-w-[100px]">
            <span className="text-sm text-gray-500">NIM</span>
            <span className="text-sm font-bold">{params.nim}</span>
          </div>
          <div className="flex flex-col min-w-[100px]">
            <span className="text-sm text-gray-500">Kelompok</span>
            <span className="text-sm font-bold">
              {data?.data.kelompok_nomor}
            </span>
          </div>
          <div className="flex flex-col min-w-[130px]">
            <span className="text-sm text-gray-500">Nilai Akhir Modul</span>
            <span className="text-sm font-bold">
              {data?.data.nilaiAkhir?.nilai}
            </span>
          </div>
          <div className="flex flex-col min-w-[100px]">
            <span className="text-sm text-gray-500">Tingkat</span>
            <span className="text-sm font-bold">
              {data?.data.nilaiAkhir?.tingkat}
            </span>
          </div>
        </div>
      </div>

      <Separator className="h-0.5 rounded-full my-6" />

      <div>
        <NimDetailHasilPenilaianMahasiswa
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
