"use client";

import { useState, useEffect, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useGetModulById } from "@/services/api/modul";
import { DataTablePesertaModul } from "@/features/modul/add-modul/data-table";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type PageProps = { params: { id: number } };

interface Pemicu {
  id: number;
  nomorPemicu: number;
  ilmuNama: string;
  dosenNama: string;
  created_at: string;
  updated_at: string;
}

interface Praktikum {
  id: number;
  nama: string;
}

interface PenilaianProsesPraktikum {
  id: number;
  praktikum: Praktikum;
  jenis_nilai: string | null;
  jenis_nilai_id: number;
  jenis_nilai_nama: string;
  bobot: number;
  created_at: string;
  updated_at: string;
}

interface PenilaianModul {
  id: number;
  modul_id: number;
  total_soal_sum1: number;
  total_soal_sum2: number;
  total_her_sum1: number;
  total_her_sum2: number;
  created_at: string;
  updated_at: string;
  penilaian_proses_praktikums: PenilaianProsesPraktikum[];
}

const Page = ({ params }: PageProps) => {
  const { data } = useGetModulById(params.id);
  const router = useRouter();

  const groupedPemicus = useMemo(() => {
    if (!data?.pemicus) return {};
    return data.pemicus.reduce((acc: any, pemicu: Pemicu) => {
      const key = String(pemicu.nomorPemicu);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(pemicu);
      return acc;
    }, {} as Record<string, Pemicu[]>);
  }, [data?.pemicus]);

  const orderedPenilaianProses = useMemo(() => {
    if (!data?.penilaian_moduls || !data?.praktikums) return [];
    const praktikumIds = data.praktikums.map((p: any) => p.id);
    return (
      data.penilaian_moduls[0]?.penilaian_proses_praktikums.sort(
        (a: any, b: any) => {
          return (
            praktikumIds.indexOf(a.praktikum.id) -
            praktikumIds.indexOf(b.praktikum.id)
          );
        }
      ) || []
    );
  }, [data?.penilaian_moduls, data?.praktikums]);

  const totalPeserta = data?.peserta_moduls.length || 0;

  return (
    <div className="flex flex-col mb-10">
      <div className="flex justify-between">
        <span className="text-3xl font-bold mb-6">
          {data?.nama_modul || "Loading..."}
        </span>
        <div className="flex flex-col">
          <span>Total Peserta</span>
          <span className="font-bold">{totalPeserta}</span>
        </div>
      </div>

      <Separator className="h-0.5 rounded-full" />

      <div className="mt-6">
        <div className="flex flex-col">
          <span className="text-xl font-semibold">Data General Modul</span>
          <span className="text-xs">Data Umum Pada Modul</span>

          <div className="flex flex-col md:flex-row gap-4 mt-5">
            <div className="flex flex-col w-full gap-y-2">
              <Label>Nama Modul</Label>
              <Input
                className="w-full"
                value={data?.nama_modul || ""}
                disabled
              />
            </div>
            <div className="flex flex-col w-full gap-y-2">
              <Label>Tahun Mulai</Label>
              <Input
                className="w-full"
                value={data?.tahun_mulai || ""}
                disabled
              />
            </div>
            <div className="flex flex-col w-full gap-y-2">
              <Label>Tahun Selesai</Label>
              <Input
                className="w-full"
                value={data?.tahun_selesai || ""}
                disabled
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-8">
          <span className="text-xl font-semibold">
            Penanggung Jawab TIM Akademik
          </span>
          <span className="text-xs">Pastikan Data Yang Dimasukkan Benar</span>

          <div className="flex flex-col w-full gap-y-2 mt-5">
            <Label>Tim Akademik</Label>
            <Input
              className="w-full"
              value={data?.penanggung_jawab || ""}
              disabled
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-8">
        <span className="text-xl font-semibold">
          Pengaturan Bobot Nilai Akhir
        </span>
        <span className="text-xs">Total Penilaian Bobot 100%</span>

        <div className="flex flex-col md:flex-row gap-4 mt-5">
          <div className="flex flex-col w-full gap-y-2">
            <Label>Nilai Akhir Sumatif (%)</Label>
            <Input
              className="w-full"
              value={data?.bobot_nilai_akhir[0]?.nilaiSumatif || ""}
              disabled
            />
          </div>
          <div className="flex flex-col w-full gap-y-2">
            <Label>Nilai Akhir Proses (%)</Label>
            <Input
              className="w-full"
              value={data?.bobot_nilai_akhir[0]?.nilaiProses || ""}
              disabled
            />
          </div>
          <div className="flex flex-col w-full gap-y-2">
            <Label>Nilai Akhir Praktikum (%)</Label>
            <Input
              className="w-full"
              value={data?.bobot_nilai_akhir[0]?.nilaiPraktik || ""}
              disabled
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-8">
        <span className="text-xl font-semibold">
          Pengaturan Bobot Nilai Proses
        </span>
        <span className="text-xs">Total Penilaian Bobot 100%</span>

        <div className="flex flex-col md:flex-row gap-4 mt-5">
          <div className="flex flex-col w-full gap-y-2">
            <Label>Diskusi Kelompok (%)</Label>
            <Input
              className="w-full"
              value={data?.bobot_nilai_proses[0]?.diskusiKelompok || ""}
              disabled
            />
          </div>
          <div className="flex flex-col w-full gap-y-2">
            <Label>Buku Catatan (%)</Label>
            <Input
              className="w-full"
              value={data?.bobot_nilai_proses[0]?.bukuCatatan || ""}
              disabled
            />
          </div>
          <div className="flex flex-col w-full gap-y-2">
            <Label>Temu Pakar (%)</Label>
            <Input
              className="w-full"
              value={data?.bobot_nilai_proses[0]?.temuPakar || ""}
              disabled
            />
          </div>
          <div className="flex flex-col w-full gap-y-2">
            <Label>Peta Konsep (%)</Label>
            <Input
              className="w-full"
              value={data?.bobot_nilai_proses[0]?.petaKonsep || ""}
              disabled
            />
          </div>
          <div className="flex flex-col w-full gap-y-2">
            <Label>Proses Praktikum (%)</Label>
            <Input
              className="w-full"
              value={data?.bobot_nilai_proses[0]?.prosesPraktikum || ""}
              disabled
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-8">
        <span className="text-xl font-semibold">Pengaturan Praktikum</span>
        <span className="text-xs">Detail Praktikum Pada Modul</span>

        <div className="flex flex-col gap-4 mt-5">
          {data?.praktikums?.map((p: any) => (
            <div className="flex flex-col w-full gap-y-2" key={p.id}>
              <Label>Nama Praktikum</Label>
              <Input className="w-full" value={p.praktikum || ""} disabled />
            </div>
          ))}
        </div>
      </div>

      {Object.entries(groupedPemicus as Record<string, Pemicu[]>).map(
        ([nomorPemicu, pemicuList], index) => (
          <div className="flex flex-col mt-8" key={index}>
            <span className="text-2xl font-semibold">Pemicu {nomorPemicu}</span>
            <span className="text-xs">Detail Dokter Pada Pemicu</span>

            {pemicuList.map((pemicu: Pemicu, idx: number) => (
              <div
                className="flex flex-col md:flex-row gap-4 mt-5"
                key={pemicu.id || idx}
              >
                <div className="flex flex-col w-full gap-y-2">
                  <Label>Nama Ilmu</Label>
                  <Input
                    className="w-full"
                    value={pemicu.ilmuNama || ""}
                    disabled
                  />
                </div>
                <div className="flex flex-col w-full gap-y-2">
                  <Label>Nama Dokter</Label>
                  <Input
                    className="w-full"
                    value={pemicu.dosenNama || ""}
                    disabled
                  />
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <div className="flex flex-col ">
        <span className="text-2xl font-bold my-8">Detail Nilai Sumatif</span>
        <span className="text-xl font-semibold">
          Form Soal Penilaian Sumatif
        </span>
        <span className="text-xs">Detail Soal Sumatif</span>

        <div className="flex flex-col md:flex-row gap-4 mt-5">
          <div className="flex flex-col w-full gap-y-2">
            <Label>Total Soal Sumatif 1</Label>
            <Input
              className="w-full"
              value={data?.penilaian_moduls[0]?.total_soal_sum1 || ""}
              disabled
            />
          </div>
          <div className="flex flex-col w-full gap-y-2">
            <Label>Total Soal Sumatif 2</Label>
            <Input
              className="w-full"
              value={data?.penilaian_moduls[0]?.total_soal_sum2 || ""}
              disabled
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-4">
        <span className="text-xl font-semibold">
          Form Soal Penilaian Her Sumatif
        </span>
        <span className="text-xs">Detail Soal Sumatif</span>

        <div className="flex flex-col md:flex-row gap-4 mt-5">
          <div className="flex flex-col w-full gap-y-2">
            <Label>Total Soal Her Sumatif 1</Label>
            <Input
              className="w-full"
              value={data?.penilaian_moduls[0]?.total_her_sum1 || ""}
              disabled
            />
          </div>
          <div className="flex flex-col w-full gap-y-2">
            <Label>Total Soal Her Sumatif 2</Label>
            <Input
              className="w-full"
              value={data?.penilaian_moduls[0]?.total_her_sum2 || ""}
              disabled
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <span className="text-2xl font-bold my-8">
          Detail Nilai Proses Praktikum
        </span>
        <span className="text-xl font-semibold">
          Form Nilai Proses Praktikum
        </span>
        <span className="text-xs">Nilai Proses Praktikum</span>

        <div className="mt-5 md:mt-0">
          {orderedPenilaianProses.map((p: PenilaianProsesPraktikum) => (
            <div
              className="flex flex-col md:flex-row gap-y-5 md:my-4 md:gap-x-4"
              key={p.id}
            >
              <div className="flex flex-col w-full gap-y-2">
                <Label>Nama Praktikum</Label>
                <Input
                  className="w-full"
                  value={p.praktikum.nama || ""}
                  disabled
                />
              </div>
              <div className="flex flex-col w-full gap-y-2">
                <Label>Jenis Nilai</Label>
                <Input
                  className="w-full"
                  value={p.jenis_nilai_nama || ""}
                  disabled
                />
              </div>
              <div className="flex flex-col w-full mb-4 md:mb-0 gap-y-2">
                <Label>Bobot (%)</Label>
                <Input
                  className="w-full"
                  value={p.bobot.toString() || ""}
                  disabled
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col mt-8">
        <span className="text-xl font-semibold">Daftar Peserta Modul</span>
        <span className="text-xs mb-4">List Peserta Yang Terdaftar</span>

        <DataTablePesertaModul
          data={
            data?.peserta_moduls.map((p: any, index: number) => ({
              no: index + 1,
              namaSiswa: p.nama_siswa || "",
              nim: p.nim || "",
              angkatan: p.angkatan?.toString() || "",
              kelompok_nomor: p.kelompok_nomor || null,
            })) || []
          }
        />
      </div>

      <div className="flex justify-end mt-8">
        <Button variant="blue" onClick={() => router.push("/admin/modul")}>
          Kembali
        </Button>
      </div>
    </div>
  );
};

export default Page;
