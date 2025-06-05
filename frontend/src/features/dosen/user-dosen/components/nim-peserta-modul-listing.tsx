"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/navigation";

type NimPesertaModulDosenProps = {
  modul: string;
  inputPenilaian: {
    totalBenarSumatif1: number;
    totalBenarSumatif2: number;
    totalBenarHerSumatif1: number | null;
    totalBenarHerSumatif2: number | null;
    diskusiKelompok: Record<string, number>;
    bukuCatatan: Record<string, number>;
    temuPakar: Record<string, number>;
    petaKonsep: Record<
      string,
      Record<string, { dokter: string; nilai: number }>
    >;
    prosesPraktikum: Record<string, { jenisNilai: string; nilai: number }>;
    nilaiPraktikum: Record<string, number>;
    nilaiHerPraktikum: Record<string, number>;
  };
  nilaiSumatif: {
    rataRataSumatif: number;
    rataRataHerSumatif: number;
    nilaiAkhir: number;
  };
  nilaiProses: {
    diskusiKelompok: {
      dk1: number;
      dk2: number;
      nilaiAkhir: number;
      detail: { key: string; nilai: number }[];
    };
    bukuCatatan: {
      nilaiAkhir: number;
      detail: { label: string; nilai: number }[];
    };
    temuPakar: {
      nilaiAkhir: number;
      detail: { label: string; nilai: number }[];
    };
    petaKonsep: {
      nilaiAkhir: number;
      rataRataPerPemicu: { [key: number]: number };
      detail: { pemicu: number; ilmu: string; dokter: string; nilai: number }[];
    };
    prosesPraktikum: {
      nilaiAkhir: number;
      detail: {
        praktikum_id: number;
        nama_praktikum: string;
        jenis_nilai: string;
        nilai: number;
      }[];
    };
    nilaiAkhir: number;
  };
  nilaiPraktikum: {
    praktikum: {
      praktikum_id: number;
      nama_praktikum: string;
      nilai: number;
      nilaiHer: number;
      nilaiAkhir: number;
    }[];
    rataRataPraktikum: number;
    rataRataHerPraktikum: number;
    nilaiAkhirPraktikum: number;
  };
};

export default function NimPesertaModulDosen({
  modul,
  inputPenilaian,
  nilaiSumatif,
  nilaiProses,
  nilaiPraktikum,
}: NimPesertaModulDosenProps) {
  const router = useRouter();
  return (
    <div className="flex flex-col">
      <div>
        <span className="text-xl font-semibold">Nilai Sumatif {modul}</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <div className="w-full">
            <Label>Nilai Sumatif 1</Label>
            <Input value={inputPenilaian?.totalBenarSumatif1 || ""} readOnly />
          </div>
          <div className="w-full">
            <Label>Nilai Sumatif 2</Label>
            <Input value={inputPenilaian?.totalBenarSumatif2 || ""} readOnly />
          </div>
          <div className="w-full">
            <Label>Rata Rata Nilai Sumatif</Label>
            <Input value={nilaiSumatif?.rataRataSumatif || ""} readOnly />
          </div>
        </div>

        <div className="mt-5">
          <span className="text-xl font-semibold">
            Nilai Her Sumatif {modul}
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div className="w-full">
              <Label>Nilai Akhir Her Sumatif 1</Label>
              <Input
                value={inputPenilaian?.totalBenarHerSumatif1 || ""}
                readOnly
              />
            </div>
            <div className="w-full">
              <Label>Nilai Her Sumatif 2</Label>
              <Input
                value={inputPenilaian?.totalBenarHerSumatif2 || ""}
                readOnly
              />
            </div>
            <div className="w-full">
              <Label>Rata Rata Nilai Her Sumatif</Label>
              <Input value={nilaiSumatif?.rataRataHerSumatif || ""} readOnly />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <span className="text-xl font-semibold">Nilai Akhir Sumatif</span>
          <div className="mt-3">
            <div className="w-full">
              <Label>Nilai Akhir Sumatif</Label>
              <Input value={nilaiSumatif?.nilaiAkhir || ""} readOnly />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col">
          <span className="text-xl font-semibold">Nilai Catatan {modul}</span>
          <span className="mt-3 text-lg">Nilai Catatan Berdasarkan Pemicu</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            {Object.entries(inputPenilaian?.bukuCatatan || {}).map(
              ([label, nilai]) => (
                <div key={label} className="w-full">
                  <Label>Pemicu {label}</Label>
                  <Input value={nilai || ""} readOnly />
                </div>
              )
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-col">
          <span className="mt-3 text-lg font-semibold">
            Nilai Akhir Buku Catatan
          </span>
          <div className="mt-3">
            <div className="w-full">
              <Label>Nilai Akhir Buku Catatan</Label>
              <Input
                value={nilaiProses?.bukuCatatan.nilaiAkhir || ""}
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col">
          <span className="text-xl font-semibold">Nilai DK {modul}</span>
          <span className="mt-3">DK1</span>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
            {Object.entries(inputPenilaian?.diskusiKelompok || {})
              .filter(([key]) => key.startsWith("DK1-P"))
              .map(([key, nilai]) => (
                <div key={key} className="w-full">
                  <Label>{key}</Label>
                  <Input value={nilai || ""} readOnly />
                </div>
              ))}
            <div className="w-full">
              <Label>Rata Rata DK1</Label>
              <Input value={nilaiProses?.diskusiKelompok.dk1 || ""} readOnly />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
            {Object.entries(inputPenilaian?.diskusiKelompok || {})
              .filter(([key]) => key.startsWith("DK2-P"))
              .map(([key, nilai]) => (
                <div key={key} className="w-full">
                  <Label>{key}</Label>
                  <Input value={nilai || ""} readOnly />
                </div>
              ))}
            <div className="w-full">
              <Label>Rata Rata DK2</Label>
              <Input value={nilaiProses?.diskusiKelompok.dk2 || ""} readOnly />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col">
          <span className="mt-3 text-lg font-semibold">Nilai Akhir DK</span>
          <div className="mt-3">
            <div className="w-full">
              <Label>Nilai Akhir DK</Label>
              <Input
                value={nilaiProses?.diskusiKelompok.nilaiAkhir || ""}
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col">
          <span className="text-xl font-semibold">
            Nilai Temu Pakar {modul}
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
            {Object.entries(inputPenilaian?.temuPakar || {}).map(
              ([label, nilai]) => (
                <div key={label} className="w-full">
                  <Label>Pemicu {label}</Label>
                  <Input value={nilai || ""} readOnly />
                </div>
              )
            )}
            <div className="w-full">
              <Label>Rata Rata Temu Pakar</Label>
              <Input value={nilaiProses?.temuPakar.nilaiAkhir || ""} readOnly />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col">
          <span className="mt-3 text-lg font-semibold">
            Nilai Akhir Temu Pakar
          </span>
          <div className="mt-3">
            <div className="w-full">
              <Label>Nilai Akhir Temu Pakar</Label>
              <Input value={nilaiProses?.temuPakar.nilaiAkhir || ""} readOnly />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col">
          <span className="text-xl font-semibold">
            Nilai Peta Konsep {modul}
          </span>
          {Object.entries(inputPenilaian?.petaKonsep || {}).map(
            ([pemicu, entries]) => (
              <div key={pemicu} className="mt-5 flex flex-col">
                <span className="mt-3 text-lg font-semibold">
                  Pemicu {pemicu}
                </span>
                {Object.entries(entries).map(([ilmu, detail]) => (
                  <div
                    key={ilmu}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3"
                  >
                    <div className="w-full">
                      <Label>Nama Ilmu</Label>
                      <Input value={ilmu} readOnly />
                    </div>
                    <div className="w-full">
                      <Label>Nama Dokter</Label>
                      <Input value={detail.dokter || ""} readOnly />
                    </div>
                    <div className="w-full">
                      <Label>Nilai</Label>
                      <Input value={detail.nilai || ""} readOnly />
                    </div>
                  </div>
                ))}
                <div className="mt-5 flex flex-col">
                  <div className="w-full">
                    <Label>Rata Rata Peta Konsep P{pemicu}</Label>
                    <Input
                      value={
                        nilaiProses?.petaKonsep?.rataRataPerPemicu?.[
                          Number(pemicu)
                        ] || ""
                      }
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        <div className="mt-5 flex flex-col">
          <span className="mt-3 text-lg font-semibold">
            Nilai Akhir Peta Konsep
          </span>
          <div className="mt-3">
            <div className="w-full">
              <Label>Nilai Akhir Peta Konsep</Label>
              <Input
                value={nilaiProses?.petaKonsep?.nilaiAkhir || ""}
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col">
          <span className="text-xl font-semibold">Nilai Praktikum {modul}</span>
          {nilaiPraktikum?.praktikum.map((praktikum, index) => (
            <div
              key={index}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-3"
            >
              <div className="w-full">
                <Label>Nama Praktikum</Label>
                <Input value={praktikum.nama_praktikum || ""} readOnly />
              </div>
              <div className="w-full">
                <Label>Nilai</Label>
                <Input value={praktikum.nilai || ""} readOnly />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-col">
          <span className="mt-3 text-lg font-semibold">
            Nilai Rata Rata Praktikum
          </span>
          <div className="mt-3">
            <div className="w-full">
              <Label>Nilai Rata Rata Praktikum</Label>
              <Input value={nilaiPraktikum?.rataRataPraktikum || ""} readOnly />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col">
          <span className="text-xl font-semibold">
            Nilai Her Praktikum {modul}
          </span>
          {nilaiPraktikum?.praktikum.map((praktikum, index) => (
            <div
              key={index}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-3"
            >
              <div className="w-full">
                <Label>Nama Praktikum</Label>
                <Input value={praktikum.nama_praktikum || ""} readOnly />
              </div>
              <div className="w-full">
                <Label>Nilai</Label>
                <Input value={praktikum.nilaiHer || ""} readOnly />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-col">
          <span className="mt-3 text-lg font-semibold">
            Nilai Her Rata Rata Praktikum
          </span>
          <div className="mt-3">
            <div className="w-full">
              <Label>Nilai Her Rata Rata Praktikum</Label>
              <Input
                value={nilaiPraktikum?.rataRataHerPraktikum || ""}
                readOnly
              />{" "}
              {/* Asumsi sama, sesuaikan jika berbeda */}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col">
          <span className="mt-3 text-lg font-semibold">
            Nilai Akhir Praktikum
          </span>
          <div className="mt-3">
            <div className="w-full">
              <Label>Nilai Akhir Praktikum</Label>
              <Input
                value={nilaiPraktikum?.nilaiAkhirPraktikum || ""}
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-10 mb-10">
          <Button variant={"blue"} onClick={() => router.back()}>Kembali</Button>
        </div>
      </div>
    </div>
  );
}
