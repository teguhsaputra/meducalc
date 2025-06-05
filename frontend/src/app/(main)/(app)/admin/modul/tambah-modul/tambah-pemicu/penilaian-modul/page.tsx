"use client";

import React, { useEffect, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { Plus, Trash } from "lucide-react";
import { useAddPenilaianModul } from "@/services/api/modul";
import {
  useGetJenisPenilaian,
  useGetPraktikumByModul,
} from "@/services/api/praktikum";
import { useModulContext } from "@/hooks/use-modul-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  total_soal_sum1: z
    .number({
      invalid_type_error: "Masukkan angka yang valid",
      required_error: "Total Soal Sumatif 1 wajib diisi",
    })
    .min(0, "Nilai tidak boleh negatif"),
  total_soal_sum2: z
    .number({
      invalid_type_error: "Masukkan angka yang valid",
      required_error: "Total Soal Sumatif 2 wajib diisi",
    })
    .min(0, "Nilai tidak boleh negatif"),
  total_soal_her_sum1: z
    .number({
      invalid_type_error: "Masukkan angka yang valid",
      required_error: "Total Soal Her Sumatif 1 wajib diisi",
    })
    .min(0, "Nilai tidak boleh negatif"),
  total_soal_her_sum2: z
    .number({
      invalid_type_error: "Masukkan angka yang valid",
      required_error: "Total Soal Her Sumatif 2 wajib diisi",
    })
    .min(0, "Nilai tidak boleh negatif"),
  penilaianProses: z
    .array(
      z.object({
        praktikum_id: z.string(),
        jenis_nilai_id: z
          .string()
          .min(1, "Pilih jenis nilai yang valid")
          .refine(
            (val) => !isNaN(parseInt(val, 10)),
            "Jenis Nilai ID harus berupa angka"
          ),
        bobot: z
          .number({
            invalid_type_error: "Masukkan angka yang valid",
            required_error: "Bobot wajib diisi",
          })
          .min(1, "Bobot tidak boleh negatif")
          .max(100, "Bobot tidak boleh lebih dari 100")
          .optional(),
      })
    )
    .min(1, "Setidaknya satu penilaian proses harus ditambahkan")
    .refine(
      (items) => {
        const totalBobot = items.reduce(
          (sum, item) => sum + (item.bobot || 0),
          0
        );
        return totalBobot === 100;
      },
      { message: "Bobot wajib diisi dan minimal 1", path: ["penilaianProses"] }
    )
    .refine(
      (items) => {
        const bobotPerPraktikum = new Map<string, number>();
        items.forEach((item) => {
          const currentTotal = bobotPerPraktikum.get(item.praktikum_id) || 0;
          bobotPerPraktikum.set(
            item.praktikum_id,
            currentTotal + (item.bobot || 0)
          );
        });

        return Array.from(bobotPerPraktikum.values()).every(
          (total) => total <= 100
        );
      },
      {
        message: "Total bobot per praktikum tidak boleh lebih dari 30%",
        path: ["penilaianProses"],
      }
    ),
});

type FormValues = z.infer<typeof formSchema>;

const Page = () => {
  const { mutate, isPending: isMutating } = useAddPenilaianModul();
  const { data: praktikumOptions } = useGetPraktikumByModul();
  const { data: jenisNilaiOptions } = useGetJenisPenilaian();
  const modul_id = useModulContext((state) => state.modul_id);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      total_soal_sum1: undefined,
      total_soal_sum2: undefined,
      total_soal_her_sum1: undefined,
      total_soal_her_sum2: undefined,
      penilaianProses: [],
    },
  });

  const {
    fields: penilaianProsesFields,
    append: appendPenilaianProses,
    remove: removePenilaianProses,
  } = useFieldArray({
    control: form.control,
    name: "penilaianProses",
  });

  const penilaianProses = form.watch("penilaianProses");

  const totalBobot = penilaianProses.reduce(
    (sum, field) => sum + (field.bobot || 0),
    0
  );
  const sisaBobot = 100 - totalBobot;

  useEffect(() => {
    if (praktikumOptions && penilaianProsesFields.length === 0) {
      praktikumOptions.forEach((praktikum: any) => {
        appendPenilaianProses({
          praktikum_id: `${praktikum.id}`,
          jenis_nilai_id: "",
          bobot: undefined,
        });
      });
    }
  }, [praktikumOptions, appendPenilaianProses, penilaianProsesFields.length]);

  function onSubmit(values: FormValues) {
    console.log("Payload:", values);

    if (!modul_id) {
      toast.error("Modul ID tidak ditemukan");
      return;
    }

    const payload = {
      modul_id,
      total_soal_sum1: values.total_soal_sum1,
      total_soal_sum2: values.total_soal_sum2,
      total_soal_her_sum1: values.total_soal_her_sum1,
      total_soal_her_sum2: values.total_soal_her_sum2,
      penilaianProses: values.penilaianProses.map((item) => ({
        praktikum_id: parseInt(item.praktikum_id, 10),
        jenis_nilai_id: parseInt(item.jenis_nilai_id, 10),
        bobot: item.bobot!,
      })),
    };

    mutate(payload);
  }

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 tracking-[-0.03]">
        Tambah Penilaian Modul
      </h2>
      <Separator className="h-0.5 bg-gray-200 rounded-full" />
      <div className="mt-4 md:mt-6">
        <h3 className="text-lg md:text-xl font-semibold">
          Form Penilaian Modul Organ Dalam Jantung
        </h3>
        <div className="flex flex-col mt-3 md:mt-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 md:space-y-8"
            >
              <div className="flex flex-col bg-white rounded-lg shadow-sm">
                <span className="text-base md:text-lg font-semibold">
                  Form Soal Penilaian Sumatif
                </span>
                <span className="text-xs text-gray-500">
                  Pastikan Data Yang Dimasukkan Benar
                </span>
                <div className="flex flex-col md:flex-row w-full mt-3 gap-3 md:gap-4">
                  <FormField
                    control={form.control}
                    name="total_soal_sum1"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Total Soal Sumatif 1</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="100"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : parseInt(e.target.value, 10)
                              )
                            }
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="total_soal_sum2"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Total Soal Sumatif 2</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="120"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : parseInt(e.target.value, 10)
                              )
                            }
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col bg-white rounded-lg shadow-sm">
                <span className="text-base md:text-lg font-semibold">
                  Form Soal Penilaian Her Sumatif
                </span>
                <span className="text-xs text-gray-500">
                  Pastikan Data Yang Dimasukkan Benar
                </span>
                <div className="flex flex-col md:flex-row w-full mt-3 gap-3 md:gap-4">
                  <FormField
                    control={form.control}
                    name="total_soal_her_sum1"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Total Soal Her Sumatif 1</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="90"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : parseInt(e.target.value, 10)
                              )
                            }
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="total_soal_her_sum2"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Total Soal Her Sumatif 2</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="110"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : parseInt(e.target.value, 10)
                              )
                            }
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col bg-white rounded-lg shadow-sm">
                <span className="text-base md:text-lg font-semibold">
                  Form Penilaian Proses Praktikum
                </span>
                <span className="text-xs text-gray-500">
                  Total Penilaian Bobot Harus 100% (Sisa bobot: {sisaBobot}%)
                </span>
                <div className="mt-3 md:mt-4 space-y-4 md:space-y-6">
                  {praktikumOptions?.map((praktikum: any) => (
                    <div
                      key={praktikum.id}
                      className="p-3 md:p-4 border rounded-lg"
                    >
                      <h4 className="text-sm md:text-base font-semibold text-gray-800 mb-3 md:mb-4">
                        {praktikum.nama}
                      </h4>
                      <div className="space-y-3 md:space-y-4">
                        {penilaianProsesFields
                          .filter(
                            (field) => field.praktikum_id === `${praktikum.id}`
                          )
                          .map((field, index) => (
                            <FormPenilaianProses
                              key={field.id}
                              control={form.control}
                              globalIndex={penilaianProsesFields.findIndex(
                                (f) => f.id === field.id
                              )}
                              praktikum={praktikum}
                              jenisNilaiOptions={jenisNilaiOptions || []}
                              localIndex={index}
                              remove={() =>
                                removePenilaianProses(
                                  penilaianProsesFields.findIndex(
                                    (f) => f.id === field.id
                                  )
                                )
                              }
                              isDisabled={isMutating}
                              totalBobot={totalBobot}
                              sisaBobot={sisaBobot}
                            />
                          ))}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          appendPenilaianProses({
                            praktikum_id: `${praktikum.id}`,
                            jenis_nilai_id: "",
                            bobot: undefined,
                          })
                        }
                        className="mt-3 md:mt-4 w-full border-2 border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors text-sm md:text-base"
                        disabled={isMutating || sisaBobot <= 0}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Penilaian Proses untuk {praktikum.nama}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isMutating}
                  className="w-full md:w-auto"
                >
                  Kembali
                </Button>
                <Button
                  type="submit"
                  variant="blue"
                  disabled={isMutating}
                  className="w-full md:w-auto"
                >
                  {isMutating ? "Menyimpan..." : "Simpan dan Selesai"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

const FormPenilaianProses = ({
  control,
  globalIndex,
  praktikum,
  jenisNilaiOptions,
  remove,
  localIndex,
  isDisabled,
  totalBobot,
  sisaBobot,
}: {
  control: any;
  globalIndex: number;
  praktikum: { id: number; nama: string };
  jenisNilaiOptions: { id: number; jenis_penilaian: string }[];
  remove: () => void;
  localIndex: number;
  isDisabled: boolean;
  totalBobot: number;
  sisaBobot: number;
}) => {
  const currentFieldBobot =
    control._formValues.penilaianProses[globalIndex]?.bobot || 0;
  const adjustedTotalBobot = totalBobot - currentFieldBobot;
  const adjustedSisaBobot = 100 - adjustedTotalBobot;

  return (
    <div className="flex flex-col md:flex-row items-end w-full gap-3">
      <FormField
        control={control}
        name={`penilaianProses.${globalIndex}.praktikum_id`}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="text-xs md:text-sm font-medium">
              Nama Praktikum
            </FormLabel>
            <FormControl>
              <Input
                value={praktikum.nama}
                disabled
                className="cursor-not-allowed text-xs md:text-sm"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`penilaianProses.${globalIndex}.jenis_nilai_id`}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="text-xs md:text-sm font-medium text-gray-700">
              Jenis Nilai
            </FormLabel>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isDisabled || !jenisNilaiOptions.length}
              >
                <SelectTrigger className="border-gray-300 text-xs md:text-sm h-10">
                  <SelectValue placeholder="Pilih Jenis Nilai" />
                </SelectTrigger>
                <SelectContent>
                  {jenisNilaiOptions.map((jenis) => (
                    <SelectItem
                      key={jenis.id}
                      value={`${jenis.id}`}
                      className="text-xs md:text-sm"
                    >
                      {jenis.jenis_penilaian}
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
        control={control}
        name={`penilaianProses.${globalIndex}.bobot`}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="text-xs md:text-sm font-medium text-gray-700">
              Bobot (%) - Sisa: {adjustedSisaBobot}%
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="25"
                {...field}
                onChange={(e) => {
                  const value =
                    e.target.value === ""
                      ? undefined
                      : parseInt(e.target.value, 10);
                  if (value !== undefined && value > adjustedSisaBobot) {
                    field.onChange(adjustedSisaBobot);
                  } else {
                    field.onChange(value);
                  }
                }}
                value={field.value ?? ""}
                className="border-gray-300 text-xs md:text-sm h-10"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        type="button"
        size="sm"
        onClick={remove}
        className="bg-red-50 px-3 h-10 hover:bg-red-100 text-red-600 border border-red-200 mb-1"
        disabled={isDisabled || localIndex === 0}
      >
        <Trash className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Page;
