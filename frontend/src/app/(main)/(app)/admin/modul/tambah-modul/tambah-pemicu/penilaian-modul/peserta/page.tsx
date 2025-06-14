"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import PesertaListing from "@/features/peserta/peserta-listing";
import { useModulContext } from "@/hooks/use-modul-context";
import { withAuth } from "@/hooks/with-auth";
import { useAddPesertaModul } from "@/services/api/modul";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";

interface Peserta {
  id: string;
  nama_siswa: string;
  nim: number;
  angkatan: number;
  username: string;
}

const Page = () => {
  const { mutate, isPending } = useAddPesertaModul();
  const modul_id = useModulContext((state) => state.modul_id);
  const [namaSiswa, setNamaSiswa] = useState("");
  const [nim, setNim] = useState("");
  const [angkatan, setAngkatan] = useState("");
  const [selectedPeserta, setSelectedPeserta] = useState<Peserta[]>([]);
  const router = useRouter();

  const handleSearch = () => {
    console.log("Searching with:", { namaSiswa, nim, angkatan });
  };

  const handleSave = useCallback(() => {
    if (!modul_id) {
      toast.error("Modul ID tidak ditemukan");
      return;
    }

    if (selectedPeserta.length === 0) {
      toast.error("Pilih setidaknya satu peserta");
      return;
    }

    const mahasiswaIds = selectedPeserta
      .map((peserta) => {
        const id = parseInt(peserta.id, 10);
        if (isNaN(id)) {
          toast.error(
            `Invalid ID for peserta: ${peserta.nama_siswa || "unknown"}`
          );
          return null;
        }
        return id;
      })
      .filter((id): id is number => id !== null);

    if (mahasiswaIds.length === 0) {
      toast.error("No valid mahasiswa IDs");
      return;
    }

    console.log("modul_id:", modul_id);
    console.log("selectedPeserta:", selectedPeserta);
    console.log("mahasiswaIds:", mahasiswaIds);

    mutate(
      { mahasiswaId: mahasiswaIds },
      {
        onError: (error) => {
          console.error("Mutation error:", error);
          toast.error("Gagal menambahkan peserta: " + error.message);
        },
      }
    );
  }, [modul_id, selectedPeserta, mutate]);

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 tracking-tight">
        Tambah Peserta Modul
      </h2>

      <div className="h-0.5 bg-gray-200 rounded-full mb-6" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="flex flex-col w-full">
          <span className="text-sm sm:text-base font-medium mb-1">
            Nama Siswa
          </span>
          <Input
            value={namaSiswa}
            onChange={(e) => setNamaSiswa(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-col w-full">
          <span className="text-sm sm:text-base font-medium mb-1">NIM</span>
          <Input
            value={nim}
            onChange={(e) => setNim(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-col w-full">
          <span className="text-sm sm:text-base font-medium mb-1">
            Angkatan
          </span>
          <Input
            placeholder="2024"
            value={angkatan}
            onChange={(e) => setAngkatan(e.target.value)}
            className="w-full"
          />
        </div>
        <Button
          className="mt-6 sm:mt-7 bg-[#0F172A] hover:bg-[#1e2a44] w-full sm:w-auto"
          onClick={handleSearch}
        >
          Cari Data
        </Button>
      </div>

      <div className="pt-6">
        <PesertaListing
          onSelectionChange={(selected) => setSelectedPeserta(selected)}
        />
      </div>

      {selectedPeserta.length > 0 && (
        <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded-md">
          <span className="text-sm text-gray-700">
            {selectedPeserta.length} Siswa Dipilih untuk Modul{" "}
            {modul_id || "Nama Modul Tidak Diketahui"}
          </span>
        </div>
      )}

      <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="w-full sm:w-auto"
        >
          Kembali
        </Button>
        <Button
          variant="blue"
          onClick={handleSave}
          disabled={isPending || selectedPeserta.length === 0}
          className="w-full sm:w-auto"
        >
          {isPending ? "Menyimpan..." : "Simpan dan Lanjutkan"}
        </Button>
      </div>
    </div>
  );
};

export default withAuth(Page);
