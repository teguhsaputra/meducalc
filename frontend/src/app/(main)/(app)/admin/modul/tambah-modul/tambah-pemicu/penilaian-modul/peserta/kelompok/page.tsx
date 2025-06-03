"use client";

import { Separator } from "@/components/ui/separator";
import React, { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useAddPesertaToKelompok,
  useCreateKelompok,
  useGetKelompokByModul,
  useGetPesertaByModul,
  useGetPesertaKelompokAnggota,
} from "@/services/api/modul";
import { useRouter } from "next/navigation";
import { useModulContext } from "@/hooks/use-modul-context";
import { toast } from "sonner";

interface PesertaModul {
  id: number;
  nama_siswa: string;
  nim: string;
}

interface KelompokAnggota {
  id: number;
  nama_kelompok: string;
  anggota: PesertaModul[];
}

interface Kelompok {
  id: number;
  nama_kelompok: string;
}

const Page = () => {
  const { data: kelompokList } = useGetKelompokByModul();
  const { data: pesertaModulRaw } = useGetPesertaByModul();
  const { data: kelompokAnggota } = useGetPesertaKelompokAnggota();
  const { mutate: createKelompokMutate, isPending: isCreatingKelompok } =
    useCreateKelompok();
  const { mutate: addPesertaMutate, isPending: isAddingPeserta } =
    useAddPesertaToKelompok();
  const router = useRouter();
  const modul_id = useModulContext((state) => state.modul_id);

  const [selectedPeserta, setSelectedPeserta] = useState<PesertaModul | null>(
    null
  );

  const pesertaModul = useMemo(() => {
    if (!pesertaModulRaw || !kelompokAnggota) return pesertaModulRaw || [];
    const assignedPesertaIds = new Set(
      kelompokAnggota?.flatMap((ka: KelompokAnggota) =>
        ka.anggota.map((a: PesertaModul) => a.id)
      ) || []
    );
    const filteredPeserta = pesertaModulRaw.filter(
      (pm: PesertaModul) => !assignedPesertaIds.has(pm.id)
    );
    return filteredPeserta;
  }, [pesertaModulRaw, kelompokAnggota]);

  const handleTambahKelompok = useCallback(() => {
    createKelompokMutate();
  }, [createKelompokMutate]);

  const handleHapusKelompok = (id: number) => {
    console.log("hapus kelompok", id);
  };

  const handleTambahPesertaKeKelompok = useCallback(
    (kelompokId: number) => {
      if (!selectedPeserta) {
        toast.error("Pilih peserta terlebih dahulu!");
        return;
      }

      console.log("sedning nims", [selectedPeserta.nim]);
      
      addPesertaMutate(
        {
          kelompokId,
          nims: [selectedPeserta.nim],
        },
        {
          onSuccess: () => {
            setSelectedPeserta(null);
            toast.success("Peserta berhasil ditambahkan ke kelompok");
          },
          onError: (error) => {
            toast.error("Gagal menambahkan peserta ke kelompok");
          },
        }
      );
    },
    [selectedPeserta, addPesertaMutate]
  );

  const handleHapusPesertaDariKelompok = (
    kelompokId: number,
    peserta: PesertaModul
  ) => {
    console.log("hapus peserta dari kelompok", kelompokId, peserta.id);
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-3xl font-bold pb-6 tracking-[-0.03]">
        Kelompok Modul
      </h2>

      <Separator className="h-0.5 bg-gray-200 rounded-full" />

      <div className="flex flex-row gap-4 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-1">
          {kelompokList?.map((kelompok: Kelompok) => {
            const anggotaKelompok = kelompokAnggota
              ? kelompokAnggota.find(
                  (ka: KelompokAnggota) => ka.id === kelompok.id
                )?.anggota || []
              : [];
            console.log(
              `Anggota untuk ${kelompok.nama_kelompok}:`,
              anggotaKelompok
            );
            return (
              <div
                key={kelompok.id}
                className="w-full border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">
                    {kelompok.nama_kelompok}
                  </h3>
                  <Button
                    size="icon"
                    onClick={() => handleHapusKelompok(kelompok.id)}
                    className="text-red-500 hover:text-red-700 bg-accent hover:bg-accent"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
                <ul className="list-disc list-inside text-sm space-y-1 mb-2">
                  {anggotaKelompok.map((anggota: any) => (
                    <li
                      key={anggota.id}
                      className="flex items-center justify-between"
                    >
                      <span>{anggota.nama_siswa}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleHapusPesertaDariKelompok(kelompok.id, anggota)
                        }
                        className="text-zinc-400 hover:text-red-500 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </li>
                  ))}
                </ul>
                <div className="mt-2">
                  <Button
                    variant="outline"
                    className="w-full border-2 border-dashed border-blue-500 text-blue-700"
                    size="sm"
                    onClick={() => handleTambahPesertaKeKelompok(kelompok.id)}
                    disabled={!selectedPeserta || isAddingPeserta}
                  >
                    Pilih Kelompok
                  </Button>
                </div>
              </div>
            );
          })}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Button
              variant="ghost"
              className="text-muted-foreground"
              onClick={handleTambahKelompok}
              disabled={isCreatingKelompok}
            >
              + Tambah Kelompok
            </Button>
          </div>
        </div>

        <div className="w-44 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Peserta Modul</h3>
          <ul className="space-y-2">
            {pesertaModul?.length > 0 ? (
              pesertaModul.map((peserta: PesertaModul) => (
                <li
                  key={peserta.id}
                  className={`text-sm p-2 rounded cursor-pointer transition-colors flex justify-between ${
                    selectedPeserta?.nim === peserta.nim
                      ? "bg-[#F3FDEE] text-black"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() =>
                    setSelectedPeserta(
                      selectedPeserta?.nim === peserta.nim ? null : peserta
                    )
                  }
                >
                  <span>{peserta.nama_siswa}</span>
                  <span
                    className={cn(
                      "bg-accent hover:bg-accent rounded-full px-2 py-2 text-black",
                      selectedPeserta?.nim === peserta.nim ? "bg-green-200" : ""
                    )}
                  >
                    <Plus className="w-2 h-2" />
                  </span>
                </li>
              ))
            ) : (
              <li className="text-gray-500">Tidak ada peserta tersedia</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Kembali
        </Button>
        <Button
          variant="blue"
          onClick={() => router.push(`/admin/modul/tambah-modul/${modul_id}`)}
        >
          Tambah Modul
        </Button>
      </div>
    </div>
  );
};

export default Page;
