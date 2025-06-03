"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import NimInputPenilaian from "@/features/admin/input-penilaian/slug-listing/nim-input-penilaian/page";
import { SlugListing } from "@/features/admin/input-penilaian/slug-listing/slug-listing";
import { TableDetailMahasiswaListing } from "@/features/mahasiswa/admin/components/table-detail-mahasiswa";
import { useGetDetailMahasiswaByNim } from "@/services/api/mahasiswa";
import { useRouter } from "next/navigation";
import React from "react";

type PageProps = { params: { nim: string } };

const Page = ({ params }: PageProps) => {
  const router = useRouter();

  const { data, isPending } = useGetDetailMahasiswaByNim(params.nim);
  return (
    <div>
      <div className="flex flex-col ">
        <div className="flex items-center gap-3">
          <h3 className="text-3xl font-bold">Detail Mahasiswa</h3>
          <h3 className="text-3xl font-bold">-</h3>
          <h3 className="text-3xl font-bold">{params.nim}</h3>
        </div>
        <div className="flex flex-col gap-10 md:gap-5 text-sm mt-5">
          <div className="flex items-center gap-4">
            <div className="w-full">
              <Label>Nama Depan</Label>
              <Input value={data?.nama_depan || ""} readOnly />
            </div>
            <div className="w-full">
              <Label>Nama Belakang</Label>
              <Input value={data?.nama_belakang || ""} readOnly />
            </div>
          </div>

          <div className="mt-5">
            <span className="text-base font-medium">Tanggal Lahir</span>
            <div className="flex items-center gap-4 mt-4">
              <div className="w-full">
                <Label>Hari</Label>
                <Input value={data?.tanggal_lahir?.hari || ""} readOnly />
              </div>
              <div className="w-full">
                <Label>Bulan</Label>
                <Input value={data?.tanggal_lahir?.bulan || ""} readOnly />
              </div>
              <div className="w-full">
                <Label>Tahun</Label>
                <Input value={data?.tanggal_lahir?.tahun || ""} />
              </div>
            </div>
          </div>

          <div className="mt-5">
            <span className="text-base font-medium">Data Kampus</span>
            <div className="flex items-center gap-4 mt-4">
              <div className="w-full">
                <Label>Jenis Kelamin</Label>
                <Input
                  value={data?.data_kampus?.jenis_kelamin || ""}
                  readOnly
                />
              </div>
              <div className="w-full">
                <Label>NIM</Label>
                <Input value={data?.data_kampus?.nim || ""} readOnly />
              </div>
              <div className="w-full">
                <Label>Angkatan</Label>
                <Input value={data?.data_kampus?.angkatan || ""} readOnly />
              </div>
            </div>
          </div>

          <div className="mt-5">
            <span className="text-3xl font-bold">Modul Terdaftar</span>
            <div className="mt-4">
              <TableDetailMahasiswaListing data={data?.modul_terdaftar} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
