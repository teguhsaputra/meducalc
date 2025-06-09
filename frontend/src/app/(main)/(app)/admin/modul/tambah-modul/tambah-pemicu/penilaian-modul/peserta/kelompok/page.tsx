"use client";

import { Separator } from "@/components/ui/separator";
import React, { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useAddPesertaToKelompok,
  useCreateKelompok,
  useDeleteKelompok,
  useDeletePesertaFromKelompok,
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
  kelompok_id: number
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
  const { mutate: deleteKelompokMutate, isPending: isDeleteKelomok } =
    useDeleteKelompok();
  const { mutate: addPesertaMutate, isPending: isAddingPeserta } =
    useAddPesertaToKelompok();
  const {
    mutate: deletePesertaFromKelompokMutate,
    isPending: isDeletePesertaKelomok,
  } = useDeletePesertaFromKelompok();
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

  const handleHapusKelompok = (kelompokId: number) => {
    console.log("hapus kelompok", kelompokId);
    deleteKelompokMutate({ kelompokId });
    toast.success(`Kelompok berhasil dihapus`);
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

  const handleHapusPesertaDariKelompok = (kelompokAnggotaId: number) => {
    console.log("hapus peserta dari kelompok", kelompokAnggotaId);
    deletePesertaFromKelompokMutate({ kelompokAnggotaId });
    toast.success(`Peserta berhasil dihapus`);
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl font-bold pb-4 sm:pb-6 tracking-tight">
        Kelompok Modul
      </h2>

      <div className="h-0.5 bg-gray-200 rounded-full mb-6" />

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                  className="w-full border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base sm:text-lg font-semibold truncate">
                      {kelompok.nama_kelompok}
                    </h3>
                    <Button
                      size="icon"
                      onClick={() => handleHapusKelompok(kelompok.id)}
                      className="text-red-500 hover:text-red-700 bg-accent hover:bg-accent/80 shrink-0"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                  <ul className="list-disc list-inside text-sm space-y-2 max-h-40 overflow-y-auto">
                    {anggotaKelompok.map((anggota: any) => (
                      <li
                        key={anggota.id}
                        className="flex items-center justify-between"
                      >
                        <span className="truncate">{anggota.nama_siswa}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleHapusPesertaDariKelompok(anggota.kelompokAnggotaId)
                          }
                          className="text-zinc-400 hover:text-red-500 rounded-full shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      className="w-full border-2 border-dashed border-blue-500 text-blue-700 text-sm"
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
                className="text-muted-foreground text-sm"
                onClick={handleTambahKelompok}
                disabled={isCreatingKelompok}
              >
                + Tambah Kelompok
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-60 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold mb-4">
            Peserta Modul
          </h3>
          <ul className="space-y-2 max-h-96 lg:max-h-[calc(100vh-200px)] overflow-y-auto">
            {pesertaModul?.length > 0 ? (
              pesertaModul.map((peserta: PesertaModul) => (
                <li
                  key={peserta.id}
                  className={`text-sm p-2 rounded cursor-pointer transition-colors flex justify-between items-center ${
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
                  <span className="truncate">{peserta.nama_siswa}</span>
                  <span
                    className={cn(
                      "bg-accent hover:bg-accent/80 rounded-full p-1.5",
                      selectedPeserta?.nim === peserta.nim ? "bg-green-200" : ""
                    )}
                  >
                    <Plus className="w-3 h-3" />
                  </span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 text-sm">
                Tidak ada peserta tersedia
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="w-full sm:w-auto"
        >
          Kembali
        </Button>
        <Button
          variant="blue"
          onClick={() => router.push(`/admin/modul/tambah-modul/${modul_id}`)}
          className="w-full sm:w-auto"
        >
          Tambah Modul
        </Button>
      </div>
    </div>
  );
};

export default Page;
