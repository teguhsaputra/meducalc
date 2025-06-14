"use client";

import { useEditModul, useGetModulById } from "@/services/api/modul";
import React from "react";
import { useForm } from "react-hook-form";
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

type PageProps = { params: { id: number } };

const formSchema = z.object({
  nama_modul: z.string().optional(),
  penanggung_jawab: z.string().optional(),
  bobot_nilai_proses: z
    .object({
      diskusiKelompok: z.number().min(0).max(100).optional(),
      bukuCatatan: z.number().min(0).max(100).optional(),
      temuPakar: z.number().min(0).max(100).optional(),
      petaKonsep: z.number().min(0).max(100).optional(),
      prosesPraktikum: z.number().min(0).max(100).optional(),
    })
    .refine(
      (data) => {
        const total =
          (data.diskusiKelompok || 0) +
          (data.bukuCatatan || 0) +
          (data.temuPakar || 0) +
          (data.petaKonsep || 0) +
          (data.prosesPraktikum || 0);
        return total === 0 || total === 100;
      },
      {
        message: "Total bobot nilai proses harus 100% jika diisi",
        path: ["bobot_nilai_proses"],
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
});

type FormData = z.infer<typeof formSchema>;

const Page = ({ params }: PageProps) => {
  const router = useRouter();
  const { data: modulData } = useGetModulById(params.id);
  const { mutate, isPending } = useEditModul(params.id);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_modul: "",
      penanggung_jawab: "",
      bobot_nilai_proses: {
        diskusiKelompok: 0,
        bukuCatatan: 0,
        temuPakar: 0,
        petaKonsep: 0,
        prosesPraktikum: 0,
      },
      penilaian_modul: {
        total_soal_sum1: 0,
        total_soal_sum2: 0,
        total_her_sum1: 0,
        total_her_sum2: 0,
      },
    },
  });

  React.useEffect(() => {
    if (modulData) {
      form.setValue("nama_modul", modulData.nama_modul || "");
      form.setValue("penanggung_jawab", modulData.penanggung_jawab || "");

      const bobotProses = modulData.bobot_nilai_proses[0] || {
        diskusiKelompok: 0,
        bukuCatatan: 0,
        temuPakar: 0,
        petaKonsep: 0,
        prosesPraktikum: 0,
      };
      form.setValue(
        "bobot_nilai_proses.diskusiKelompok",
        bobotProses.diskusiKelompok || 0
      );
      form.setValue(
        "bobot_nilai_proses.bukuCatatan",
        bobotProses.bukuCatatan || 0
      );
      form.setValue("bobot_nilai_proses.temuPakar", bobotProses.temuPakar || 0);
      form.setValue(
        "bobot_nilai_proses.petaKonsep",
        bobotProses.petaKonsep || 0
      );
      form.setValue(
        "bobot_nilai_proses.prosesPraktikum",
        bobotProses.prosesPraktikum || 0
      );

      const penilaian = modulData.penilaian_moduls[0] || {
        total_soal_sum1: 0,
        total_soal_sum2: 0,
        total_her_sum1: 0,
        total_her_sum2: 0,
      };
      form.setValue(
        "penilaian_modul.total_soal_sum1",
        penilaian.total_soal_sum1 || 0
      );
      form.setValue(
        "penilaian_modul.total_soal_sum2",
        penilaian.total_soal_sum2 || 0
      );
      form.setValue(
        "penilaian_modul.total_her_sum1",
        penilaian.total_her_sum1 || 0
      );
      form.setValue(
        "penilaian_modul.total_her_sum2",
        penilaian.total_her_sum2 || 0
      );
    }
  }, [modulData, form]);

  function onSubmit(values: FormData) {
    // const updateModulData = {
    //   nama_modul: values.nama_modul,
    //   penanggung_jawab: values.penanggung_jawab,
    //   bobot_nilai_proses: {
    //     diskusi: values.nilaiProsesDiskusi,
    //     buku_catatan: values.nilaiProsesBukuCatatan,
    //     temu_pakar: values.nilaiProsesTemuPakar,
    //     peta_konsep: values.nilaiProsesPetaKonsep,
    //     proses_praktik: values.nilaiProsesPraktik,
    //   },
    //   total_soal_sum1: values.total_soal_sum1,
    //   total_soal_sum2: values.total_soal_sum2,
    //   total_soal_her_sum1: values.total_soal_her_sum1,
    //   total_soal_her_sum2: values.total_soal_her_sum2,
    // };
    // mutate(update);
  }

  return (
    <div className="flex flex-col">
      <div className="flex mt-5">
        <span className="text-3xl font-bold tracking-[-3%]">
          {modulData?.nama_modul}
        </span>
      </div>

      <Separator className="h-0.5 rounded-full my-6" />

      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <div className="flex flex-col mb-5">
                <span className="text-2xl font-bold">Data General Modul</span>
                <span className="text-xs text-foreground font-normal">
                  Opsional, biarkan kosong jika tidak ingin diubah
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
                <span className="text-2xl font-bold">Data General Modul</span>
                <span className="text-xs text-foreground font-normal">
                  Opsional, biarkan kosong jika tidak ingin diubah
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <FormField
                  control={form.control}
                  name="penanggung_jawab"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Penanggung Jawab</FormLabel>
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
                <span className="text-2xl font-bold">Bobot Nilai Proses</span>
                <span className="text-xs text-foreground font-normal">
                  Opsional, total bobot harus 100% jika diisi
                </span>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="bobot_nilai_proses.diskusiKelompok"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Diskusi (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseFloat(e.target.value) || undefined
                            )
                          }
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bobot_nilai_proses.bukuCatatan"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Buku Catatan (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseFloat(e.target.value) || undefined
                            )
                          }
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bobot_nilai_proses.temuPakar"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Temu Pakar (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseFloat(e.target.value) || undefined
                            )
                          }
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bobot_nilai_proses.petaKonsep"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Peta Konsep (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseFloat(e.target.value) || undefined
                            )
                          }
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bobot_nilai_proses.prosesPraktikum"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Proses Praktik (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseFloat(e.target.value) || undefined
                            )
                          }
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="h-0.5 rounded-full my-6" />

            <div>
              <div className="flex flex-col mb-5">
                <span className="text-2xl font-bold">Penilaian Modul</span>
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
                      <FormLabel>Total Soal SUM 1</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseInt(e.target.value) || undefined
                            )
                          }
                          value={field.value || ""}
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
                      <FormLabel>Total Soal SUM 2</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseInt(e.target.value) || undefined
                            )
                          }
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="penilaian_modul.total_her_sum1"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Total HER SUM 1</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseInt(e.target.value) || undefined
                            )
                          }
                          value={field.value || ""}
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
                      <FormLabel>Total HER SUM 2</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseInt(e.target.value) || undefined
                            )
                          }
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

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
