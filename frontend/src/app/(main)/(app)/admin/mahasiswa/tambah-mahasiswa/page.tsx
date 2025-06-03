"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useAddDosen } from "@/services/api/dosen";
import { useAddMahasiswa } from "@/services/api/mahasiswa";
const formSchema = z.object({
  namaDepan: z.string().nonempty({ message: "Harap ini tidak dikosongkan" }),
  namaBelakang: z.string().nonempty({ message: "Harap ini tidak dikosongkan" }),
  tanggalLahir: z
    .string()
    .nonempty({ message: "Harap ini tidak dapat dikosongkan" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Format tanggal tidak valid" }),
  jenisKelamin: z
    .string()
    .nonempty({ message: "Harap ini tidak dapat dikosongkan" })
    .refine((val) => ["Pria", "Perempuan"].includes(val), {
      message: "Jenis kelamin harus 'Pria' atau 'Perempuan'",
    }),
  nim: z.string().nonempty({ message: "Harap nim ini tidak dikosongkan" }),
  angkatan: z
    .number()
    .min(2015, { message: "Angkatan tidak valid" })
    .max(2045, { message: "Angkatan tidak boleh melebihi 2045" }),
  username: z
    .string()
    .nonempty({ message: "Harap username ini tidak dikosongkan" }),
  password: z
    .string()
    .nonempty({ message: "Harap password ini tidak dikosongkan" }),
});

const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month, 0).getDate();
};

const months = [
  { value: "1", label: "Januari" },
  { value: "2", label: "Februari" },
  { value: "3", label: "Maret" },
  { value: "4", label: "April" },
  { value: "5", label: "Mei" },
  { value: "6", label: "Juni" },
  { value: "7", label: "Juli" },
  { value: "8", label: "Agustus" },
  { value: "9", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

const currentYear = new Date().getFullYear(); // 2025
const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) =>
  (currentYear - i).toString()
);

const angkatanOptions = Array.from({ length: 2045 - 2015 + 1 }, (_, i) =>
  (2015 + i).toString()
);

const Page = () => {
  const router = useRouter();
  const { mutate, isPending } = useAddMahasiswa();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      namaDepan: "",
      namaBelakang: "",
      tanggalLahir: "",
      jenisKelamin: "",
      nim: "",
      angkatan: 2025, // Default angkatan ke tahun saat ini (2025)
      username: "",
      password: "",
    },
  });

  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [angkatan, setAngkatan] = useState("2025"); // Default state untuk angkatan

  const days = Array.from(
    {
      length: getDaysInMonth(
        month ? parseInt(month) : 1,
        year ? parseInt(year) : currentYear
      ),
    },
    (_, i) => (i + 1).toString()
  );

  useEffect(() => {
    if (
      day &&
      month &&
      year &&
      parseInt(day) > getDaysInMonth(parseInt(month), parseInt(year))
    ) {
      setDay("");
    }
  }, [day, month, year]);

  useEffect(() => {
    if (day && month && year) {
      const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;
      form.setValue("tanggalLahir", formattedDate, { shouldValidate: true });
    } else {
      form.setValue("tanggalLahir", "", { shouldValidate: true });
    }
  }, [day, month, year, form]);

  useEffect(() => {
    if (angkatan) {
      form.setValue("angkatan", parseInt(angkatan), { shouldValidate: true });
    } else {
      form.setValue("angkatan", 2025, { shouldValidate: true });
    }
  }, [angkatan, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    mutate({
      namaDepan: values.namaDepan,
      namaBelakang: values.namaBelakang,
      tanggalLahir: values.tanggalLahir,
      jenisKelamin: values.jenisKelamin,
      nim: values.nim,
      angkatan: values.angkatan,
      username: values.username,
      password: values.password,
    });
  }

  return (
    <div className="flex flex-col">
      <div className="flex mt-5">
        <span className="text-5xl font-bold tracking-[-3%]">
          Tambah Mahasiswa
        </span>
      </div>

      <Separator className="h-0.5 rounded-full my-6" />

      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <div className="flex flex-col mb-5">
                <span className="text-2xl font-bold">Data Diri</span>
                <span className="text-xs text-foreground font-normal">
                  Harap memasukkan data dengan benar
                </span>
              </div>
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="namaDepan"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Nama Depan</FormLabel>
                      <FormControl>
                        <Input placeholder="Ahmad Sobiro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="namaBelakang"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Nama Belakang</FormLabel>
                      <FormControl>
                        <Input placeholder="Saputra" {...field} />
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
                <span className="text-base font-semibold">Tanggal Lahir</span>
                <span className="text-xs text-foreground font-normal">
                  Harap memasukkan data dengan benar
                </span>
              </div>
              <div className="flex items-center gap-4">
                <FormItem className="w-full">
                  <FormLabel>Hari</FormLabel>
                  <Select onValueChange={setDay} value={day}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {days.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
                <FormItem className="w-full">
                  <FormLabel>Bulan</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      setMonth(value);
                      if (day) {
                        setDay("");
                      }
                    }}
                    value={month}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="08" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {months.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
                <FormItem className="w-full">
                  <FormLabel>Tahun</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      setYear(value);
                      if (day) {
                        setDay("");
                      }
                    }}
                    value={year}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="2022" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {years.map((y) => (
                          <SelectItem key={y} value={y}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              </div>
              <FormField
                control={form.control}
                name="tanggalLahir"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <div className="flex flex-col mb-5">
                <span className="text-base font-semibold">Data Kampus</span>
                <span className="text-xs text-foreground font-normal">
                  Harap memasukkan data dengan benar
                </span>
              </div>
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="jenisKelamin"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Jenis Kelamin</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Pria">Pria</SelectItem>
                            <SelectItem value="Perempuan">Perempuan</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nim"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>NIM</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="angkatan"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Angkatan</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          setAngkatan(value);
                        }}
                        value={angkatan}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih angkatan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {angkatanOptions.map((y) => (
                              <SelectItem key={y} value={y}>
                                {y}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <div className="flex flex-col mb-5">
                <span className="text-base font-semibold">Akun Mahasiswa</span>
                <span className="text-xs text-foreground font-normal">
                  Harap memasukkan data dengan benar
                </span>
              </div>
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="ricomania" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="ini password"
                          {...field}
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
              <Button type="submit" variant="blue" className="mb-16" disabled={isPending}>
                Tambahkan Mahasiswa
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
