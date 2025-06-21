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
import SearchDosenPenanggungJawab from "@/features/modul/components/search-dosen-penanggung-jawab";
import { withAuth } from "@/hooks/with-auth";
import { Card } from "@/components/ui/card";

const formSchema = z
  .object({
    nama: z.string().min(1, "Nama modul harus diisi"),
    tahunMulai: z.string().min(1, "Tahun mulai harus diisi"),
    tahunSelesai: z.string().min(1, "Tahun selesai harus diisi"),
    timAkademik: z.string().min(1, "Penanggung jawab harus diisi"),
    nilaiAkhirSumatif: z
      .number()
      .min(0, "Nilai sumatif tidak boleh negatif")
      .optional(),
    nilaiAkhirProses: z
      .number()
      .min(0, "Nilai proses tidak boleh negatif")
      .optional(),
    nilaiAkhirPraktikum: z
      .number()
      .min(0, "Nilai praktikum tidak boleh negatif")
      .optional(),
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
    nilaiProsesKKD: z
      .number({ invalid_type_error: "Nilai proses praktik" })
      .min(0, "Nilai proses praktik tidak boleh tidak boleh negatif"),
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
      .optional(),
    pilihanPraktikum: z
      .array(
        z.object({
          value: z.string().min(1, "Pilih praktikum yang sesuai"),
        })
      )
      .min(1, "Setidaknya satu praktikum harus dipilih"),
  })
  .refine(
    (data) => {
      if (
        data.nilaiAkhirSumatif === undefined ||
        data.nilaiAkhirProses === undefined ||
        data.nilaiAkhirPraktikum === undefined
      ) {
        return true;
      }

      return (
        data.nilaiAkhirSumatif +
          data.nilaiAkhirProses +
          data.nilaiAkhirPraktikum ===
        100
      );
    },
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
        data.nilaiProsesKKD <=
      100,
    {
      message: "Total nilai proses tidak boleh lebih dari 100%",
      path: ["nilaiProsesDiskusi"],
    }
  )
  .refine(
    (data) => {
      const totalNilai =
        data.nilaiProses?.reduce((sum, item) => sum + (item.nilai ?? 0), 0) ||
        0;
      return totalNilai <= 100;
    },
    {
      message: "Total nilai proses tidak boleh lebih dari 100%",
      path: ["nilaiProses"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

const Page = () => {
  const { mutate, isPending } = useCreateModul();
  const { data: praktikumOptions } = useGetPraktikum();
  const router = useRouter();

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
      nilaiProsesKKD: undefined,
      nilaiProses: [],
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

  const {
    fields: nilaiProsesFields,
    append: appendNilaiProses,
    remove: removeNilaiProses,
  } = useFieldArray({
    control: form.control,
    name: "nilaiProses" as const,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pilihanPraktikum" as const,
  });

  // 2. Define a submit handler.
  function onSubmit(values: FormValues) {
    // console.log(values);
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
      bobot_nilai_proses_default: {
        diskusi: values.nilaiProsesDiskusi,
        buku_catatan: values.nilaiProsesBukuCatatan,
        temu_pakar: values.nilaiProsesTemuPakar,
        peta_konsep: values.nilaiProsesPetaKonsep,
        proses_praktik: values.nilaiProsesKKD,
      },
      bobot_nilai_proses:
        values.nilaiProses?.reduce(
          (acc, item) => ({
            ...acc,
            [item.nama.toLowerCase().replace(/\s/g, "_")]: item.nilai ?? 0,
          }),
          {}
        ) || {},
      praktikum_id: values.pilihanPraktikum.map((p) => parseInt(p.value)),
    };

    mutate(createModulData);
  }

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
        Tambah Modul
      </h2>

      <Separator className="h-0.5 rounded-full" />

      <div className="mt-4 md:mt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 md:space-y-8"
          >
            {/* Data General Modul */}
            <div className="flex flex-col">
              <span className="text-lg md:text-xl text-foreground font-semibold">
                Data General Modul
              </span>
              <span className="text-xs font-normal">
                Pastikan data yang dimasukkan benar
              </span>
              <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-2">
                <FormField
                  control={form.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem className="w-full">
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
                    <FormItem className="w-full">
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
                    <FormItem className="w-full">
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

            {/* Penanggung Jawab TIM Akademik */}
            <div className="flex flex-col">
              <span className="text-lg md:text-xl text-foreground font-semibold">
                Penanggung Jawab TIM Akademik
              </span>
              <span className="text-xs font-normal">
                Pastikan data yang dimasukkan benar
              </span>

              <FormField
                control={form.control}
                name="timAkademik"
                render={({ field }) => (
                  <FormItem className="mt-2 w-full">
                    <FormLabel>Tim Akademik</FormLabel>
                    <FormControl>
                      <SearchDosenPenanggungJawab
                        control={form.control}
                        name="timAkademik"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Pengaturan Bobot Nilai Akhir */}
            <div className="flex flex-col">
              <span className="text-lg md:text-xl text-foreground font-semibold">
                Pengaturan Bobot Nilai Akhir
              </span>
              <span className="text-xs font-normal">
                Total penilaian bobot harus 100%
              </span>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-2">
                <FormField
                  control={form.control}
                  name="nilaiAkhirSumatif"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Nilai Akhir Sumatif (%)</FormLabel>
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
                  name="nilaiAkhirProses"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Nilai Akhir Proses (%)</FormLabel>
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
                  name="nilaiAkhirPraktikum"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Nilai Akhir Praktikum (%)</FormLabel>
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

            {/* Pengaturan Bobot Nilai Proses */}
            <div className="flex flex-col">
              <span className="text-lg md:text-xl text-foreground font-semibold">
                Pengaturan Bobot Nilai Proses
              </span>
              <span className="text-xs font-normal">
                Total penilaian bobot harus 100%
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4 mt-2">
                <FormField
                  control={form.control}
                  name="nilaiProsesDiskusi"
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
                  name="nilaiProsesBukuCatatan"
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
                  name="nilaiProsesTemuPakar"
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
                  name="nilaiProsesPetaKonsep"
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
                  name="nilaiProsesKKD"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>KKD (%)</FormLabel>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4 mt-2">
                {nilaiProsesFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex gap-2 p-5 bg-neutral-50 rounded-[40px] "
                  >
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name={`nilaiProses.${index}.nama`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama Nilai Proses</FormLabel>
                            <FormControl>
                              <Input placeholder="Contoh: Diskusi" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`nilaiProses.${index}.nilai`}
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <FormLabel>Nilai (%)</FormLabel>
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
                      <div className="flex justify-end mt-4">
                        <Button
                          type="button"
                          size="icon"
                          className="bg-muted hover:bg-muted mb-2"
                          onClick={() => removeNilaiProses(index)}
                        >
                          <Trash className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  appendNilaiProses({ nama: "", nilai: undefined })
                }
                className="mt-3 border-[1.5px] border-dashed border-gray-300 text-muted-foreground"
              >
                + Tambah Pengaturan Bobot Nilai Proses
              </Button>
            </div>

            {/* Pengaturan Praktikum */}
            <div className="flex flex-col">
              <span className="text-lg md:text-xl text-foreground font-semibold">
                Pengaturan Praktikum
              </span>
              <span className="text-xs font-normal">
                Pastikan data yang dipilih benar
              </span>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-2 items-end"
                >
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
                  <div className="mb-2 sm:mb-0">
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
                className="mt-3 border-[1.5px] border-dashed border-gray-300 text-muted-foreground"
              >
                + Tambah Praktikum
              </Button>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 md:gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-full sm:w-auto"
              >
                Kembali
              </Button>
              <Button
                type="submit"
                variant="blue"
                disabled={isPending}
                className="w-full sm:w-auto"
              >
                {isPending ? "Disimpan..." : "Simpan dan Lanjutkan"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default withAuth(Page);
