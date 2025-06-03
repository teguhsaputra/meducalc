"use client";

import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { useGetIlmuAndDosen } from "@/services/api/dosen";
import { useAddPemicuModul } from "@/services/api/modul";
import { useModulContext } from "@/hooks/use-modul-context";
import { TCreatePemicus } from "@/types/types";

const formSchema = z.object({
  pemicu: z
    .array(
      z.object({
        ilmuDokter: z
          .array(
            z.object({
              ilmuId: z
                .string()
                .min(1, "Pilih ilmu yang valid")
                .refine((val) => !isNaN(parseInt(val, 10)), "Ilmu ID harus berupa angka"),
              dokterId: z
                .string()
                .min(1, "Pilih dokter yang valid")
                .refine((val) => !isNaN(parseInt(val, 10)), "Dokter ID harus berupa angka"),
            })
          )
          .min(1, "Setidaknya satu ilmu dan dokter harus dipilih"),
      })
    )
    .min(3, "Minimal 3 pemicu harus ditambahkan"),
});

type FormValues = z.infer<typeof formSchema>;

const TambahPemicuPage = () => {
  const { data } = useGetIlmuAndDosen();
  const { mutate, isPending } = useAddPemicuModul();
  const modul_id = useModulContext((state) => state.modul_id);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pemicu: [
        { ilmuDokter: [{ ilmuId: "", dokterId: "" }] },
        { ilmuDokter: [{ ilmuId: "", dokterId: "" }] },
        { ilmuDokter: [{ ilmuId: "", dokterId: "" }] },
      ],
    },
  });

  const {
    fields: pemicuFields,
    append: appendPemicu,
    remove: removePemicu,
  } = useFieldArray({
    control: form.control,
    name: "pemicu",
  });

  const doctors = useMemo(
    () => ["Dr. Wiri", "Dr. Afifah", "Dr. Anfiah", "Dr. Nazir", "Dr. Steven"],
    []
  );

  function onSubmit(values: FormValues) {
    console.log("Form Values:", values);
    if (!modul_id) {
      console.error("Modul ID tidak ditemukan");
      return;
    }

    const pemicus = values.pemicu.flatMap((pemicu, index) =>
      pemicu.ilmuDokter.map((item) => ({
        nomor_pemicu: index + 1,
        ilmuId: parseInt(item.ilmuId, 10),
        dokterId: parseInt(item.dokterId, 10),
      }))
    );

    if (pemicus.length < 3) {
      console.error("Minimal 3 pemicu diperlukan");
      return;
    }

    if (pemicus.some((p) => isNaN(p.ilmuId) || isNaN(p.dokterId))) {
      console.error("Invalid ilmuId or dokterId detected");
      return;
    }

    mutate({ pemicus });
  };

  return (
    <div className="flex flex-col ">
      <h2 className="text-3xl font-bold mb-6 tracking-[-0.03]">
        Tambah Pemicu
      </h2>
      <Separator className="h-0.5 bg-gray-200 rounded-full" />
      <div className="mt-6">
        <div className="flex flex-col">
          <span className="text-xl font-semibold text-foreground">
            Pemicu Modul (Minimal 3)
          </span>
          <span className="text-xs font-normal text-muted-foreground">
            Pastikan data yang dimasukkan benar
          </span>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {pemicuFields.map((field, index) => (
              <PemicuItem
                key={field.id}
                control={form.control}
                index={index}
                doctors={data?.dosen}
                ilmus={data?.ilmu}
                register={form.register}
                removePemicu={(i) => removePemicu(i)}
                pemicuFields={pemicuFields}
              />
            ))}
            <Button
              type="button"
              variant="default"
              onClick={() =>
                appendPemicu({
                  ilmuDokter: [{ ilmuId: "", dokterId: "" }],
                })
              }
              className="mt-4 border-[1px] w-full"
            >
              + Tambah Pemicu
            </Button>
            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline">Kembali</Button>
              <Button type="submit" variant="blue">
                {isPending ? "Menyimpan..." : "Simpan dan Lanjutkan"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

const PemicuItem = ({
  control,
  index,
  removePemicu,
  doctors,
  ilmus,
  register,
  pemicuFields,
}: {
  control: any;
  index: number;
  removePemicu: (index: number) => void;
  register: any;
  doctors: [
    {
      id: number;
      nama_dosen: string;
    }
  ];
  ilmus: [
    {
      id: number;
      nama_ilmu: string;
    }
  ];
  pemicuFields: any[];
}) => {
  const {
    fields: ilmuDokterFields,
    append: appendIlmuDokter,
    remove: removeIlmuDokter,
  } = useFieldArray({
    control,
    name: `pemicu.${index}.ilmuDokter`,
  });

  return (
    <div className="flex flex-col mt-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <span className="text-base font-semibold">Pemicu {index + 1}</span>
          <span className="text-xs font-normal text-muted-foreground">
            Detail pemicu minimal 1 dokter
          </span>
        </div>

        {ilmuDokterFields.map((ilmuDokterField, ilmuDokterIndex) => (
          <div key={ilmuDokterField.id} className="flex items-end w-full">
            <FormField
              control={control}
              name={`pemicu.${index}.ilmuDokter.${ilmuDokterIndex}.ilmuId`}
              render={({ field }) => (
                <FormItem className="w-full mr-4">
                  <FormLabel>Pilih Ilmu</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Ilmu" />
                      </SelectTrigger>
                      <SelectContent>
                        {ilmus?.map((ilmu) => (
                          <SelectItem key={ilmu.id} value={`${ilmu.id}`}>
                            {ilmu.nama_ilmu}
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
              name={`pemicu.${index}.ilmuDokter.${ilmuDokterIndex}.dokterId`}
              render={({ field }) => (
                <FormItem className="w-full mr-4">
                  <FormLabel>Pilih Dokter</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Dokter" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors?.map((doctor) => (
                          <SelectItem key={doctor.id} value={`${doctor.id}`}>
                            {doctor.nama_dosen}
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
              <Button
                type="button"
                size="icon"
                onClick={() => {
                  if (
                    ilmuDokterFields.length === 1 &&
                    pemicuFields.length > 3
                  ) {
                    removePemicu(index);
                  } else if (ilmuDokterFields.length > 1) {
                    removeIlmuDokter(ilmuDokterIndex);
                  }
                }}
                className="bg-muted hover:bg-gray-200"
                disabled={
                  ilmuDokterFields.length === 1 && pemicuFields.length <= 3
                }
              >
                <Trash className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => appendIlmuDokter({ ilmuId: "", dokterId: "" })}
          className="mt-2 border-[1px] border-dashed border-gray-300 text-muted-foreground"
        >
          + Tambah Pakar
        </Button>
      </div>
    </div>
  );
};

export default TambahPemicuPage;
