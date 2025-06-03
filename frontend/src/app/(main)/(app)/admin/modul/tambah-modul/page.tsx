"use client";

import React, { useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash } from "lucide-react";
import { useCreateModul } from "@/services/api/modul";
import { useGetPraktikum } from "@/services/api/praktikum";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    nama: z.string().min(1, "Nama modul harus diisi"),
    tahunMulai: z.string().min(1, "Tahun mulai harus diisi"),
    tahunSelesai: z.string().min(1, "Tahun selesai harus diisi"),
    timAkademik: z.string().min(1, "Penanggung jawab harus diisi"),
    nilaiAkhirSumatif: z
      .number({ invalid_type_error: "Nilai sumatif harus diisi" })
      .min(0, "Nilai sumatif tidak boleh negatif"),
    nilaiAkhirProses: z
      .number({ invalid_type_error: "Nilai proses harus diisi" })
      .min(0, "Nilai proses tidak boleh negatif"),
    nilaiAkhirPraktikum: z
      .number({ invalid_type_error: "Nilai praktikum harus diisi" })
      .min(0, "Nilai praktikum tidak boleh negatif"),
    nilaiProsesDiskusi: z
      .number({ invalid_type_error: "Nilai diskusi harus diisi" })
      .min(0, "Nilai diskusi tidak boleh negatif"),
    nilaiProsesBukuCatatan: z
      .number({ invalid_type_error: "Nilai buku catatan harus diisi" })
      .min(0, "Nilai buku catatan tidak boleh negatif"),
    nilaiProsesTemuPakar: z
      .number({ invalid_type_error: "Nilai temu pakar harus diisi" })
      .min(0, "Nilai temu pakar tidak boleh negatif"),
    nilaiProsesPetaKonsep: z
      .number({ invalid_type_error: "Nilai peta konsep harus diisi" })
      .min(0, "Nilai peta konsep tidak boleh negatif"),
    nilaiProsesPraktik: z
      .number({ invalid_type_error: "Nilai proses praktik" })
      .min(0, "Nilai proses praktik tidak boleh tidak boleh negatif"),
    pilihanPraktikum: z
      .array(
        z.object({
          value: z.string().min(1, "Pilih praktikum yang sesuai"),
        })
      )
      .min(1, "Setidaknya satu praktikum harus dipilih"),
  })
  .refine(
    (data) =>
      data.nilaiAkhirSumatif +
        data.nilaiAkhirProses +
        data.nilaiAkhirPraktikum ===
      100,
    {
      message: "Total bobot nilai akhir harus 100%",
      path: ["nilaiAkhirSumatif"],
    }
  )
  .refine(
    (data) =>
      data.nilaiProsesDiskusi +
        data.nilaiProsesBukuCatatan +
        data.nilaiProsesTemuPakar +
        data.nilaiProsesPetaKonsep +
        data.nilaiProsesPraktik ===
      100,
    {
      message: "Total bobot nilai proses harus 100%",
      path: ["nilaiProsesDiskusi"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

const Page = () => {
  const { mutate, isPending } = useCreateModul();
  const { data: praktikumOptions } = useGetPraktikum();
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      tahunMulai: "",
      tahunSelesai: "",
      timAkademik: "",
      nilaiAkhirSumatif: undefined,
      nilaiAkhirProses: undefined,
      nilaiAkhirPraktikum: undefined,
      nilaiProsesDiskusi: undefined,
      nilaiProsesBukuCatatan: undefined,
      nilaiProsesTemuPakar: undefined,
      nilaiProsesPetaKonsep: undefined,
      nilaiProsesPraktik: undefined,
      pilihanPraktikum: [{ value: "" }],
    },
  });

  const years = useMemo(() => {
    const startYear = 1945;
    const endYear = 2045;
    return Array.from({ length: endYear - startYear + 1 }, (_, i) =>
      (startYear + i).toString()
    );
  }, []);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pilihanPraktikum" as const,
  });

  // 2. Define a submit handler.
  function onSubmit(values: FormValues) {
    console.log(values);
    const createModulData = {
      nama_modul: values.nama,
      tahun_mulai: parseInt(values.tahunMulai),
      tahun_selesai: parseInt(values.tahunSelesai),
      penanggung_jawab: values.timAkademik,
      bobot_nilai_akhir: {
        sumatif: values.nilaiAkhirSumatif,
        proses: values.nilaiAkhirProses,
        praktikum: values.nilaiAkhirPraktikum,
      },
      bobot_nilai_proses: {
        diskusi: values.nilaiProsesDiskusi,
        buku_catatan: values.nilaiProsesBukuCatatan,
        temu_pakar: values.nilaiProsesTemuPakar,
        peta_konsep: values.nilaiProsesPetaKonsep,
        proses_praktik: values.nilaiProsesPraktik,
      },
      praktikum_id: values.pilihanPraktikum.map((p) => parseInt(p.value)),
    };

    mutate(createModulData);
  }

  return (
    <div className="flex flex-col">
      <h2 className="text-3xl font-bold mb-6">Tambah Modul</h2>

      <Separator className="h-0.5 rounded-full" />

      <div className="mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col">
              <span className="text-xl text-foreground font-semibold">
                Data General Modul
              </span>
              <span className="text-xs font-normal">
                Pastikan data yang dimasukkan benar
              </span>
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem className="mt-3 w-full">
                      <FormLabel>Nama Modul</FormLabel>
                      <FormControl>
                        <Input placeholder="Organ Dalam Jantung" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tahunMulai"
                  render={({ field }) => (
                    <FormItem className="mt-3 w-full">
                      <FormLabel>Tahun mulai</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih tahun mulai" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tahunSelesai"
                  render={({ field }) => (
                    <FormItem className="mt-3 w-full">
                      <FormLabel>Tahun selesai</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih tahun selesai" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-xl text-foreground font-semibold">
                Penanggung Jawab TIM Akademik
              </span>
              <span className="text-xs font-normal">
                Pastikan data yang dimasukkan benar
              </span>

              <FormField
                control={form.control}
                name="timAkademik"
                render={({ field }) => (
                  <FormItem className="mt-3 w-full">
                    <FormLabel>Tim Akademik</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. Rico Kenny Doohan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col">
              <span className="text-xl text-foreground font-semibold">
                Pengaturan Bobot Nilai Akhir
              </span>
              <span className="text-xs font-normal">
                Total penilaian bobot harus 100%
              </span>

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="nilaiAkhirSumatif"
                  render={({ field }) => (
                    <FormItem className="mt-3 w-full">
                      <FormLabel>Nilai Akhir Sumatif (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="50"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : parseInt(e.target.value) || 0
                            )
                          }
                          value={field.value ?? null}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nilaiAkhirProses"
                  render={({ field }) => (
                    <FormItem className="mt-3 w-full">
                      <FormLabel>Nilai Akhir Proses (%)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="30"
                          {...field}
                          type="number"
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : parseInt(e.target.value) || 0
                            )
                          }
                          value={field.value ?? null}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nilaiAkhirPraktikum"
                  render={({ field }) => (
                    <FormItem className="mt-3 w-full">
                      <FormLabel>Nilai Akhir Praktikum (%)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="20"
                          {...field}
                          type="number"
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : parseInt(e.target.value) || 0
                            )
                          }
                          value={field.value ?? null}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-xl text-foreground font-semibold">
                Pengaturan Bobot Nilai Proses
              </span>
              <span className="text-xs font-normal">
                Total penilaian bobot harus 100%
              </span>

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="nilaiProsesDiskusi"
                  render={({ field }) => (
                    <FormItem className="mt-2 w-full">
                      <FormLabel>Diskusi (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="20"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? null
                                : parseInt(e.target.value) || 0
                            )
                          }
                          value={field.value ?? null}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nilaiProsesBukuCatatan"
                  render={({ field }) => (
                    <FormItem className="mt-2 w-full">
                      <FormLabel>Buku Catatan (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="20"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? null
                                : parseInt(e.target.value) || 0
                            )
                          }
                          value={field.value ?? null}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nilaiProsesTemuPakar"
                  render={({ field }) => (
                    <FormItem className="mt-2 w-full">
                      <FormLabel>Temu Pakar (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="20"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? null
                                : parseInt(e.target.value) || 0
                            )
                          }
                          value={field.value ?? null}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nilaiProsesPetaKonsep"
                  render={({ field }) => (
                    <FormItem className="mt-2 w-full">
                      <FormLabel>Peta Konsep (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="20"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? null
                                : parseInt(e.target.value) || 0
                            )
                          }
                          value={field.value ?? null}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nilaiProsesPraktik"
                  render={({ field }) => (
                    <FormItem className="mt-2 w-full">
                      <FormLabel>Proses Praktik (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="20"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? null
                                : parseInt(e.target.value) || 0
                            )
                          }
                          value={field.value ?? null}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-xl text-foreground font-semibold">
                Pengaturan Praktikum
              </span>
              <span className="text-xs font-normal">
                Pastikan data yang dipilih benar
              </span>

              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4 mt-3 items-end">
                  <FormField
                    control={form.control}
                    name={`pilihanPraktikum.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Pilihan Praktikum</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih praktikum" />
                            </SelectTrigger>
                            <SelectContent>
                              {praktikumOptions?.map((praktikum: any) => (
                                <SelectItem
                                  key={praktikum.id}
                                  value={praktikum.id.toString()}
                                >
                                  {praktikum.nama}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    {index > 0 && (
                      <Button
                        type="button"
                        size="icon"
                        className="bg-muted hover:bg-muted"
                        onClick={() => remove(index)}
                      >
                        <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ value: "" })}
                className="mt-4 border-[1.5px] border-dashed border-gray-300 text-muted-foreground"
              >
                + Tambah Praktikum
              </Button>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Kembali</Button>
              <Button type="submit" variant="blue" disabled={isPending}>
                {isPending ? "Disimpan..." : "Simpan dan Lanjutkan"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
