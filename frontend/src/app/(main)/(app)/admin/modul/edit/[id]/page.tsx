"use client";

import { useEditModul, useGetModulById } from "@/services/api/modul";
import React, { useCallback, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { withAuth } from "@/hooks/with-auth";
import { TPemicu, TPenilaianProsesPraktikum } from "@/types/types";
import { DataTablePesertaModul } from "@/features/modul/add-modul/data-table";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

type PageProps = { params: { id: number } };

const formSchema = z.object({
  nama_modul: z.string().optional(),
  penanggung_jawab: z.string().optional(),
  nilaiProses: z
    .array(
      z.object({
        nama: z.string().min(1, "Nama penilaian harus diisi"),
        nilai: z
          .number({ invalid_type_error: "Nilai harus diisi" })
          .min(0, "Nilai tidak boleh negatif")
          .optional(),
      })
    )
    .optional()
    .refine(
      (data) => {
        const totalNilai =
          data?.reduce((sum, item) => sum + (item.nilai ?? 0), 0) || 0;
        return totalNilai <= 100;
      },
      {
        message: "Total nilai proses tidak boleh lebih dari 100%",
        path: ["nilaiProses"],
      }
    ),
  bobot_nilai_proses_default: z
    .object({
      diskusi: z.number().min(0).max(100).optional(),
      buku_catatan: z.number().min(0).max(100).optional(),
      temu_pakar: z.number().min(0).max(100).optional(),
      peta_konsep: z.number().min(0).max(100).optional(),
      proses_praktik: z.number().min(0).max(100).optional(),
    })
    .refine(
      (data) => {
        const total =
          (data.diskusi ?? 0) +
          (data.buku_catatan ?? 0) +
          (data.temu_pakar ?? 0) +
          (data.peta_konsep ?? 0) +
          (data.proses_praktik ?? 0);
        return total === 0 || total <= 100;
      },
      {
        message: "Total bobot nilai proses harus 100% jika diisi",
        path: ["bobot_nilai_proses_default"],
      }
    )
    .optional(),
  penilaian_modul: z
    .object({
      total_soal_sum1: z.number().min(0).optional(),
      total_soal_sum2: z.number().min(0).optional(),
      total_her_sum1: z.number().min(0).optional(),
      total_her_sum2: z.number().min(0).optional(),
    })
    .optional(),
  peserta_moduls: z.instanceof(File).optional(),
});

type FormData = z.infer<typeof formSchema>;

const Page = ({ params }: PageProps) => {
  const router = useRouter();
  const { data: modulData } = useGetModulById(params.id);
  const { mutate, isPending } = useEditModul(params.id);
  const [previewData, setPreviewData] = useState<
    { Nim: string; Nama: string }[]
  >([]);
  const [importedPeserta, setImportedPeserta] = useState<
    { nim: string; nama_siswa: string }[]
  >([]);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_modul: "",
      penanggung_jawab: "",
      nilaiProses: [],
      bobot_nilai_proses_default: {
        diskusi: undefined,
        buku_catatan: undefined,
        temu_pakar: undefined,
        peta_konsep: undefined,
        proses_praktik: undefined,
      },
      penilaian_modul: {
        total_soal_sum1: undefined,
        total_soal_sum2: undefined,
        total_her_sum1: undefined,
        total_her_sum2: undefined,
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "nilaiProses",
  });

  const groupedPemicus = useMemo(() => {
    if (!modulData?.pemicus) return {};
    return modulData.pemicus.reduce((acc: any, pemicu: TPemicu) => {
      const key = String(pemicu.nomorPemicu);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(pemicu);
      return acc;
    }, {} as Record<string, TPemicu[]>);
  }, [modulData?.pemicus]);

  const orderedPenilaianProses = useMemo(() => {
    if (!modulData?.penilaian_moduls || !modulData?.praktikums) return [];
    const praktikumIds = modulData.praktikums.map((p: any) => p.id);
    return (
      modulData.penilaian_moduls[0]?.penilaian_proses_praktikums.sort(
        (a: any, b: any) => {
          return (
            praktikumIds.indexOf(a.praktikum.id) -
            praktikumIds.indexOf(b.praktikum.id)
          );
        }
      ) || []
    );
  }, [modulData?.penilaian_moduls, modulData?.praktikums]);

  React.useEffect(() => {
    if (modulData) {
      form.reset({
        nama_modul: modulData.nama_modul || "",
        penanggung_jawab: modulData.penanggung_jawab || "",
        bobot_nilai_proses_default: {
          diskusi: modulData.bobot_nilai_proses[0]?.diskusiKelompok ?? undefined,
          buku_catatan:
            modulData.bobot_nilai_proses[0]?.bukuCatatan ?? undefined,
          temu_pakar: modulData.bobot_nilai_proses[0]?.temuPakar ?? undefined,
          peta_konsep:
            modulData.bobot_nilai_proses[0]?.petaKonsep ?? undefined,
          proses_praktik: modulData.bobot_nilai_proses[0]?.prosesPraktikum ?? undefined,
        },
        nilaiProses: modulData.bobot_nilai_proses[0]?.nilai
          ? Object.entries(modulData.bobot_nilai_proses[0].nilai).map(
              ([nama, nilai]) => ({
                nama,
                nilai: nilai !== null ? Number(nilai) : undefined,
              })
            )
          : [],
        penilaian_modul: {
          total_soal_sum1:
            modulData.penilaian_moduls[0]?.total_soal_sum1 ?? undefined,
          total_soal_sum2:
            modulData.penilaian_moduls[0]?.total_soal_sum2 ?? undefined,
          total_her_sum1:
            modulData.penilaian_moduls[0]?.total_her_sum1 ?? undefined,
          total_her_sum2:
            modulData.penilaian_moduls[0]?.total_her_sum2 ?? undefined,
        },
      });
    }
  }, [modulData, form]);

  const handleFileUpload = useCallback(
    (file: File) => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "File terlalu besar (maks. 10MB)",
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as {
          Nim: string;
          Nama: string;
        }[];

        if (!jsonData[0]?.Nim || !jsonData[0]?.Nama) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "File Excel harus memiliki kolom 'Nim' dan 'Nama'",
          });
          return;
        }

        setPreviewData(jsonData);
        form.setValue("peserta_moduls", file);
      };
      reader.readAsArrayBuffer(file);
    },
    [form, toast]
  );

  function onSubmit(values: FormData) {
    const formData = new FormData();

    if (values.nama_modul) formData.append("nama_modul", values.nama_modul);
    if (values.penanggung_jawab)
      formData.append("penanggung_jawab", values.penanggung_jawab);

   if (values.bobot_nilai_proses_default) {
    const bobot = values.bobot_nilai_proses_default;
    if (bobot.diskusi !== undefined) {
      formData.append(`bobot_nilai_proses_default[diskusi]`, bobot.diskusi.toString());
    }
    if (bobot.buku_catatan !== undefined) {
      formData.append(`bobot_nilai_proses_default[buku_catatan]`, bobot.buku_catatan.toString());
    }
    if (bobot.temu_pakar !== undefined) {
      formData.append(`bobot_nilai_proses_default[temu_pakar]`, bobot.temu_pakar.toString());
    }
    if (bobot.peta_konsep !== undefined) {
      formData.append(`bobot_nilai_proses_default[peta_konsep]`, bobot.peta_konsep.toString());
    }
    if (bobot.proses_praktik !== undefined) {
      formData.append(`bobot_nilai_proses_default[proses_praktik]`, bobot.proses_praktik.toString());
    }
  }

    const bobotProses = (values.nilaiProses || []).reduce((acc, item) => {
      if (item.nilai !== undefined) {
        acc[item.nama.toLowerCase().replace(/\s/g, "_")] = item.nilai
      }
      return acc;
    }, {} as Record<string, number>);

    if (Object.keys(bobotProses).length > 0) {
      formData.append("bobot_nilai_proses", JSON.stringify(bobotProses));
    }

    if (values.penilaian_modul) {
      if (values.penilaian_modul.total_soal_sum1 !== undefined)
        formData.append(
          "total_soal_sum1",
          values.penilaian_modul.total_soal_sum1.toString()
        );
      if (values.penilaian_modul.total_soal_sum2 !== undefined)
        formData.append(
          "total_soal_sum2",
          values.penilaian_modul.total_soal_sum2.toString()
        );
      if (values.penilaian_modul.total_her_sum1 !== undefined)
        formData.append(
          "total_her_sum1",
          values.penilaian_modul.total_her_sum1.toString()
        );
      if (values.penilaian_modul.total_her_sum2 !== undefined)
        formData.append(
          "total_her_sum2",
          values.penilaian_modul.total_her_sum2.toString()
        );
    }

    if (values.peserta_moduls) {
      formData.append("peserta_moduls", values.peserta_moduls);
    }

    console.log("FormData:", Object.fromEntries(formData));

    mutate(formData);
  }

  const pesertaData = useMemo(() => {
    const existingPeserta =
      modulData?.peserta_moduls?.map((p: any, index: number) => ({
        no: index + 1,
        namaSiswa: p.nama_siswa || undefined,
        nim: p.nim || undefined,
        angkatan: p.angkatan?.toString() || undefined,
        kelompok_nomor: p.kelompok_nomor || undefined,
      })) || [];

    const newPeserta = importedPeserta.map((p, index) => ({
      no: existingPeserta.length + index + 1,
      namaSiswa: p.nama_siswa,
      nim: p.nim,
      angkatan: undefined,
      kelompok_nomor: null,
    }));

    return [...existingPeserta, ...newPeserta];
  }, [modulData?.peserta_moduls, importedPeserta]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mt-5">
        <span className="text-3xl font-bold tracking-[-3%]">
          {modulData?.nama_modul}
        </span>
        <Button
          variant="blue"
          onClick={() => document.getElementById("excel-import")?.click()}
        >
          <Plus className="w-4 h-4 mr-2" />
          <span>Impor Excel</span>
        </Button>
        <input
          id="excel-import"
          type="file"
          accept=".xlsx"
          className="hidden"
          onChange={(e) =>
            e.target.files?.[0] && handleFileUpload(e.target.files[0])
          }
        />
      </div>

      {previewData.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Pratinjau Data Peserta</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="border px-4 py-2">NIM</th>
                  <th className="border px-4 py-2">Nama Mahasiswa</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, idx) => (
                  <tr key={idx}>
                    <td className="border px-4 py-2">{row.Nim}</td>
                    <td className="border px-4 py-2">{row.Nama}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Separator className="h-0.5 rounded-full my-6" />

      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <div className="flex flex-col mb-5">
                <span className="text-2xl font-bold">Data General Modul</span>
                <span className="text-xs text-foreground font-normal">
                  Opsional
                </span>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <FormField
                  control={form.control}
                  name="nama_modul"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Nama Modul</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col w-full space-y-2">
                  <Label>Tahun Mulai</Label>
                  <Input value={modulData?.tahun_mulai || ""} disabled />
                </div>
                <div className="flex flex-col w-full space-y-2">
                  <Label>Tahun Selesai</Label>
                  <Input value={modulData?.tahun_selesai || ""} disabled />
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-col mb-5">
                <span className="text-2xl font-bold">
                  Penanggung Jawab TIM Akademik
                </span>
                <span className="text-xs text-foreground font-normal">
                  Opsional
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="penanggung_jawab"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Tim Akademik</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <div className="flex flex-col mb-5">
                <span className="text-2xl font-bold">
                  Pengaturan Bobot Nilai Akhir
                </span>
                <span className="text-xs text-foreground font-normal">
                  Tidak dapat diubah
                </span>
              </div>
              <div className="flex flex-col md:flex-row gap-4 mt-5">
                <div className="flex flex-col w-full gap-y-2">
                  <Label>Nilai Akhir Sumatif (%)</Label>
                  <Input
                    className="w-full"
                    value={modulData?.bobot_nilai_akhir[0]?.nilaiSumatif || ""}
                    disabled
                  />
                </div>
                <div className="flex flex-col w-full gap-y-2">
                  <Label>Nilai Akhir Proses (%)</Label>
                  <Input
                    className="w-full"
                    value={modulData?.bobot_nilai_akhir[0]?.nilaiProses || ""}
                    disabled
                  />
                </div>
                <div className="flex flex-col w-full gap-y-2">
                  <Label>Nilai Akhir Praktikum (%)</Label>
                  <Input
                    className="w-full"
                    value={modulData?.bobot_nilai_akhir[0]?.nilaiPraktik || ""}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-col mb-5">
                <span className="text-2xl font-bold">
                  Pengaturan Bobot Nilai Proses
                </span>
                <span className="text-xs text-foreground font-normal">
                  Opsional, total bobot harus 100% jika diisi
                </span>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="bobot_nilai_proses_default.diskusi"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Diskusi (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="\d*"
                          placeholder="20"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              field.onChange(undefined);
                            } else if (/^\d*$/.test(value)) {
                              field.onChange(parseInt(value));
                            }
                          }}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bobot_nilai_proses_default.buku_catatan"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Buku Catatan (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="\d*"
                          placeholder="20"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              field.onChange(undefined);
                            } else if (/^\d*$/.test(value)) {
                              field.onChange(parseInt(value));
                            }
                          }}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bobot_nilai_proses_default.temu_pakar"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Temu Pakar (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="\d*"
                          placeholder="20"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              field.onChange(undefined);
                            } else if (/^\d*$/.test(value)) {
                              field.onChange(parseInt(value));
                            }
                          }}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bobot_nilai_proses_default.peta_konsep"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Peta Konsep (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="\d*"
                          placeholder="20"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              field.onChange(undefined);
                            } else if (/^\d*$/.test(value)) {
                              field.onChange(parseInt(value));
                            }
                          }}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bobot_nilai_proses_default.proses_praktik"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Proses KKD (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="\d*"
                          placeholder="20"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              field.onChange(undefined);
                            } else if (/^\d*$/.test(value)) {
                              field.onChange(parseInt(value));
                            }
                          }}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {fields.length > 0 && (
              <div>
                <div className="flex flex-col mb-5">
                  <span className="text-2xl font-bold">
                    Penilaian Proses Dinamis
                  </span>
                  <span className="text-xs text-foreground font-normal">
                    Opsional, total bobot tidak boleh lebih dari 100% jika diisi
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex flex-col md:flex-row gap-4"
                    >
                      <FormField
                        control={form.control}
                        name={`nilaiProses.${index}.nama`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Nama Penilaian</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Masukkan nama penilaian"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`nilaiProses.${index}.nilai`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Nilai (%)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value === ""
                                      ? undefined
                                      : Number(e.target.value)
                                  )
                                }
                                value={field.value ?? ""}
                                placeholder="Masukkan nilai"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex flex-col mb-5">
                <span className="text-2xl font-bold">Pengaturan Praktikum</span>
                <span className="text-xs text-foreground font-normal">
                  Tidak bisa di ubah
                </span>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex flex-col w-full space-y-2">
                  <Label>Tahun Mulai</Label>
                  <Input
                    value={modulData?.praktikums[0].praktikum || ""}
                    disabled
                  />
                </div>
              </div>
            </div>

            <Separator className="h-0.5 rounded-full my-6" />

            <div>
              <div className="flex flex-col mb-5">
                <span className="text-2xl font-bold">Pemicu Modul</span>
                <span className="text-xs text-foreground font-normal">
                  Tidak bisa di ubah
                </span>
              </div>

              {Object.entries(groupedPemicus as Record<string, TPemicu[]>).map(
                ([nomorPemicu, pemicuList], index) => (
                  <div className="flex flex-col mt-8" key={index}>
                    <span className="text-2xl font-semibold">
                      Pemicu {nomorPemicu}
                    </span>
                    <span className="text-xs">Detail Dokter Pada Pemicu</span>

                    {pemicuList.map((pemicu: TPemicu, idx: number) => (
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
            </div>

            <Separator className="h-0.5 rounded-full my-6" />

            <div>
              <div className="flex flex-col mb-5">
                <span className="text-2xl font-bold">
                  Form Soal Penilaian Sumatif{" "}
                </span>
                <span className="text-xs text-foreground font-normal">
                  Opsional, masukkan jumlah soal jika ingin diubah
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="penilaian_modul.total_soal_sum1"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Total Soal Sumatif 1</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="\d*"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              field.onChange(undefined);
                            } else if (/^\d*$/.test(value)) {
                              field.onChange(parseInt(value));
                            }
                          }}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="penilaian_modul.total_soal_sum2"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Total Soal Sumatif 2</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="\d*"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              field.onChange(undefined);
                            } else if (/^\d*$/.test(value)) {
                              field.onChange(parseInt(value));
                            }
                          }}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col my-5 ">
                <span className="text-2xl font-bold">
                  Form Soal Penilaian Her Sumatif{" "}
                </span>
                <span className="text-xs text-foreground font-normal">
                  Opsional, masukkan jumlah soal jika ingin diubah
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="penilaian_modul.total_her_sum1"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Total Soal Her Sumatif 1</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="\d*"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              field.onChange(undefined);
                            } else if (/^\d*$/.test(value)) {
                              field.onChange(parseInt(value));
                            }
                          }}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="penilaian_modul.total_her_sum2"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Total Soal Her Sumatif 2</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="\d*"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              field.onChange(undefined);
                            } else if (/^\d*$/.test(value)) {
                              field.onChange(parseInt(value));
                            }
                          }}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <div className="flex flex-col my-5 ">
                <span className="text-2xl font-bold">
                  Form Penilaian Proses Praktikum
                </span>
                <span className="text-xs text-foreground font-normal">
                  Opsional, masukkan jumlah bobot jika ingin diubah
                </span>
              </div>

              <div className="mt-5 md:mt-0">
                {orderedPenilaianProses.map((p: TPenilaianProsesPraktikum) => (
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

            <Separator className="h-0.5 rounded-full my-6" />

            <div className="flex flex-col mt-8">
              <span className="text-xl font-semibold">
                Daftar Peserta Modul
              </span>
              <span className="text-xs mb-4">
                Opsional, List Peserta Yang Terdaftar
              </span>

              <DataTablePesertaModul data={pesertaData} />
            </div>

            <Separator className="h-0.5 rounded-full my-6" />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="mb-16"
                onClick={() => router.back()}
              >
                Batalkan
              </Button>
              <Button
                type="submit"
                variant="blue"
                className="mb-16"
                disabled={isPending}
              >
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default withAuth(Page);
