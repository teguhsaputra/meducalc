import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import {
  useGetModulByNim,
  useInputPenilaian,
} from "@/services/api/penilaian-modul";
import { Label } from "@/components/ui/label";

type Props = {
  namaModul: string;
  nim: string;
};

const formSchema = z.object({
  totalBenarSumatif1: z
    .number({ invalid_type_error: "Kolom tidak boleh kosong" })
    .min(0, { message: "Soal tidak boleh kurang dari 0" })
    .max(1000, { message: "Maksimal 1000 soal." }),
  totalBenarSumatif2: z
    .number({ invalid_type_error: "Kolom tidak boleh kosong" })
    .min(0, { message: "Soal tidak boleh kurang dari 0" })
    .max(1000, { message: "Maksimal 1000 soal." }),
  totalBenarHerSumatif1: z
    .number({ invalid_type_error: "Kolom tidak boleh kosong" })
    .min(0, { message: "Soal tidak boleh kurang dari 0" })
    .max(1000, { message: "Maksimal 1000 soal." }),
  totalBenarHerSumatif2: z
    .number({ invalid_type_error: "Kolom tidak boleh kosong" })
    .min(0, { message: "Soal tidak boleh kurang dari 0" })
    .max(1000, { message: "Maksimal 1000 soal." }),
  nilaiPraktikum: z.record(z.string()),
  nilaiHerPraktikum: z.record(z.string()),
  diskusiKelompokNilai: z.record(z.string()),
  catatanNilai: z.record(z.string()),
  temuPakarNilai: z.record(z.string()),
  petaKonsepNilai: z.record(
    z.record(
      z.object({
        ilmu: z.string().optional(),
        dokter: z.string().optional(),
        nilai: z.string().nonempty({ message: "Nilai tidak boleh kosong" }),
      })
    )
  ),
  prosesPraktikumNilai: z.record(
    z.record(
      z.object({
        praktikum: z.string().optional(),
        jenisNilai: z.string().optional(),
        nilai: z.string().nonempty({ message: "Nilai tidak boleh kosong" }),
      })
    )
  ),
});

const NimInputPenilaian = ({ namaModul, nim }: Props) => {
  const router = useRouter();
  const { mutate: submitPenilaian, isPending: isSubmitting } =
    useInputPenilaian(nim);
  const { data: modulData } = useGetModulByNim(namaModul, nim);

  const uniquePemicuList = modulData?.pemicus
    ? Array.from(new Set(modulData.pemicus.map((p: any) => p.nomorPemicu)))
    : [];

  const catatanCount = Math.max(uniquePemicuList.length, 3);
  const temuPakarCount = Math.max(uniquePemicuList.length, 3);

  const uniquePemicuNumbers = Array.from(
    new Set(modulData?.pemicus?.map((p: any) => p.nomorPemicu) || [])
  );

  const petaKonsepData = modulData?.pemicus
    ? modulData?.pemicus?.reduce((acc: any, p: any) => {
        if (!acc[p.nomorPemicu]) {
          acc[p.nomorPemicu] = {};
        }
        acc[p.nomorPemicu][p.ilmuNama] = {
          ilmu: p.ilmuNama, // Data dari API (tidak perlu default)
          dokter: p.dosenNama, // Data dari API (tidak perlu default)
          nilai: p.nilai || "", // Hanya nilai yang perlu diisi
        };
        return acc;
      }, {})
    : {};

  const prosesPraktikumData = modulData?.penilaian_moduls
    ?.penilaian_proses_praktikums
    ? modulData.penilaian_moduls.penilaian_proses_praktikums
        .sort((a: any, b: any) => a.praktikum.localeCompare(b.praktikum))
        .reduce((acc: any, pp: any) => {
          const praktikumKey = pp.praktikum;
          const jenisKey = pp.jenis_nilai;

          if (!acc[praktikumKey]) {
            acc[praktikumKey] = {};
          }

          acc[praktikumKey][jenisKey] = {
            praktikum: pp.praktikum,
            jenisNilai: pp.jenis_nilai,
            nilai: pp.nilai || "",
          };

          return acc;
        }, {} as Record<string, Record<string, { praktikum?: string; jenisNilai?: string; nilai: string }>>)
    : {};

  const defaultValues = {
    totalBenarSumatif1: 0,
    totalBenarSumatif2: 0,
    totalBenarHerSumatif1: 0,
    totalBenarHerSumatif2: 0,
    nilaiPraktikum:
      modulData?.praktikums?.reduce((acc: any, p: any) => {
        acc[p.id.toString()] = "";
        return acc;
      }, {} as Record<string, string>) || {},
    nilaiHerPraktikum:
      modulData?.praktikums?.reduce((acc: any, p: any) => {
        acc[p.id.toString()] = "";
        return acc;
      }, {} as Record<string, string>) || {},
    diskusiKelompokNilai: modulData?.peserta?.kelompok_nomor
      ? uniquePemicuNumbers.reduce(
          (acc: Record<string, string>, nomorPemicu: any) => {
            acc[`DK${modulData.peserta.kelompok_nomor}-P${nomorPemicu}`] = "";
            acc[`DK1-P${nomorPemicu}`] = "";
            acc[`DK2-P${nomorPemicu}`] = "";
            return acc;
          },
          {} as Record<string, string>
        )
      : {},
    catatanNilai: Array.from({ length: catatanCount }, (_, i) =>
      (i + 1).toString()
    ).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {} as Record<string, string>),
    temuPakarNilai: Array.from({ length: temuPakarCount }, (_, i) =>
      (i + 1).toString()
    ).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {} as Record<string, string>),
    petaKonsepNilai: petaKonsepData,
    prosesPraktikumNilai: prosesPraktikumData,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    submitPenilaian(values);
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h3 className="text-3xl font-bold">
            Input Nilai {modulData?.nama_modul || "Modul"}
          </h3>
        </div>
        <div className="flex items-center gap-10 md:gap-5 text-sm mt-5 md:mt-0">
          <div className="flex flex-col">
            <span>Nama</span>
            <span className="font-bold">
              {modulData?.peserta?.nama_siswa || "N/A"}
            </span>
          </div>
          <div className="flex flex-col">
            <span>NIM</span>
            <span className="font-bold">
              {modulData?.peserta?.nim || "N/A"}
            </span>
          </div>
          <div className="flex flex-col">
            <span>Kelompok</span>
            <span className="font-bold">
              {modulData?.peserta?.kelompok_nomor || "N/A"}
            </span>
          </div>
        </div>
      </div>

      <Separator className="h-0.5 rounded-full my-6" />

      <div className="flex flex-col mt-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col">
              <span className="text-lg font-semibold">
                Form Penilaian Akhir Sumatif
              </span>
              <span className="text-xs">Masukkan Data Dengan Benar</span>
              <div className="flex flex-col md:flex-row w-full mt-4 gap-4">
                <FormField
                  control={form.control}
                  name="totalBenarSumatif1"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        Total Benar Soal Sumatif 1 dari{" "}
                        {modulData?.penilaian_moduls?.total_soal_sum1 || 100}{" "}
                        Soal
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={
                            modulData?.penilaian_moduls?.total_soal_sum1?.toString() ||
                            "100"
                          }
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? 0
                                : parseInt(e.target.value) || 0
                            )
                          }
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totalBenarSumatif2"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        Total Benar Soal Sumatif 2 dari{" "}
                        {modulData?.penilaian_moduls?.total_soal_sum2 || 100}{" "}
                        Soal
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={
                            modulData?.penilaian_moduls?.total_soal_sum2?.toString() ||
                            "100"
                          }
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? 0
                                : parseInt(e.target.value) || 0
                            )
                          }
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Penilaian Akhir Her Sumatif */}
            <div className="flex flex-col">
              <span className="text-lg font-semibold">
                Form Penilaian Akhir Her Sumatif
              </span>
              <span className="text-xs">Masukkan Data Dengan Benar</span>
              <div className="flex flex-col md:flex-row w-full mt-4 gap-4">
                <FormField
                  control={form.control}
                  name="totalBenarHerSumatif1"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        Total Benar Soal Her Sumatif 1 dari{" "}
                        {modulData?.penilaian_moduls?.total_her_sum1 || 100}{" "}
                        Soal
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={
                            modulData?.penilaian_moduls?.total_her_sum1?.toString() ||
                            "100"
                          }
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? 0
                                : parseInt(e.target.value) || 0
                            )
                          }
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totalBenarHerSumatif2"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        Total Benar Soal Her Sumatif 2 dari{" "}
                        {modulData?.penilaian_moduls?.total_her_sum2 || 100}{" "}
                        Soal
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={
                            modulData?.penilaian_moduls?.total_her_sum2?.toString() ||
                            "100"
                          }
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? 0
                                : parseInt(e.target.value) || 0
                            )
                          }
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-semibold">
                Form Penilaian Akhir Praktikum
              </span>
              <span className="text-xs">Masukkan Data Dengan Benar</span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full mt-4 gap-4">
                {modulData?.praktikums.map((praktikum: any) => (
                  <div key={praktikum.id} className="flex items-center gap-4">
                    <FormField
                      control={form.control}
                      name={`nilaiPraktikum.${praktikum.id}`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Nama Praktikum</FormLabel>
                          <FormControl>
                            <Input value={praktikum.praktikum} readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`nilaiPraktikum.${praktikum.id}`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Masukkan Nilai</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Masukkan nilai"
                              {...field}
                              value={field.value}
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

            {/* Penilaian Akhir Her Praktikum */}
            <div className="flex flex-col">
              <span className="text-lg font-semibold">
                Form Penilaian Akhir Her Praktikum
              </span>
              <span className="text-xs">Masukkan Data Dengan Benar</span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full mt-4 gap-4">
                {modulData?.praktikums.map((praktikum: any) => (
                  <div key={praktikum.id} className="flex items-center gap-4">
                    <FormField
                      control={form.control}
                      name={`nilaiHerPraktikum.${praktikum.id}`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Nama Praktikum</FormLabel>
                          <FormControl>
                            <Input value={praktikum.praktikum} readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`nilaiHerPraktikum.${praktikum.id}`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Masukkan Nilai</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Masukkan nilai"
                              {...field}
                              value={field.value}
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

            <div className="flex flex-col">
              <h3 className="text-xl font-semibold mb-5">Nilai Akhir Proses</h3>
              <span className="text-lg font-semibold">
                Form Penilaian Diskusi Kelompok (DK)
              </span>
              <span className="text-xs">Masukkan Data Dengan Benar</span>

              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {uniquePemicuNumbers.map((nomorPemicu: any) => {
                    const key = `DK1-P${nomorPemicu}`;
                    return (
                      <FormField
                        key={key}
                        control={form.control}
                        name={`diskusiKelompokNilai.${key}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{key}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Masukkan nilai"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {uniquePemicuNumbers.map((nomorPemicu: any) => {
                    const key = `DK2-P${nomorPemicu}`;
                    return (
                      <FormField
                        key={key}
                        control={form.control}
                        name={`diskusiKelompokNilai.${key}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{key}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Masukkan nilai"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Penilaian Catatan (Logbook) */}
            <div className="flex flex-col">
              <span className="text-lg font-semibold">
                Form Penilaian Catatan (Logbook)
              </span>
              <span className="text-xs">Masukkan Data Dengan Benar</span>
              <div className="grid grid-cols-1 md:grid-cols-3 w-full mt-4 gap-4">
                {Array.from({ length: catatanCount }, (_, i) =>
                  (i + 1).toString()
                ).map((key) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`catatanNilai.${key}`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Pemicu {key}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Masukkan nilai"
                            {...field}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Penilaian Temu Pakar */}
            <div className="flex flex-col">
              <span className="text-lg font-semibold">
                Form Penilaian Temu Pakar
              </span>
              <span className="text-xs">Masukkan Data Dengan Benar</span>
              <div className="grid grid-cols-1 md:grid-cols-3 w-full mt-4 gap-4">
                {Array.from({ length: temuPakarCount }, (_, i) =>
                  (i + 1).toString()
                ).map((key) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`temuPakarNilai.${key}`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Pemicu {key}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Masukkan nilai"
                            {...field}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Penilaian Peta Konsep */}
            <div className="flex flex-col">
              <span className="text-lg font-semibold">
                Form Penilaian Peta Konsep
              </span>
              <span className="text-xs">Masukkan Data Dengan Benar</span>
              {Object.entries(petaKonsepData).map(([nomorPemicu, concepts]) => (
                <div key={nomorPemicu} className="mt-5">
                  <span className="font-bold text-xl">
                    Pemicu {nomorPemicu}
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full mt-4 gap-4">
                    {Object.entries(
                      concepts as Record<
                        string,
                        { ilmu: string; dokter: string; nilai: number }
                      >
                    ).map(([ilmu, data]) => (
                      <div key={ilmu} className="flex items-center gap-4">
                        <div className="flex flex-col w-full">
                          <Label className="mb-4">Nama Ilmu</Label>
                          <Input
                            {...form.register(
                              `petaKonsepNilai.${nomorPemicu}.${ilmu}.ilmu` as const
                            )}
                            value={data.ilmu}
                          />
                        </div>
                        <div className="flex flex-col w-full">
                          <Label className="mb-4">Nama Dokter</Label>
                          <Input
                            {...form.register(
                              `petaKonsepNilai.${nomorPemicu}.${ilmu}.dokter` as const
                            )}
                            value={data.dokter}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`petaKonsepNilai.${nomorPemicu}.${ilmu}.nilai`}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Nilai</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Masukkan nilai"
                                  {...field}
                                  value={field.value}
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
              ))}
            </div>

            {/* Penilaian Proses Praktikum */}
            <div className="flex flex-col">
              <span className="text-lg font-semibold">
                Form Penilaian Proses Praktikum
              </span>
              <span className="text-xs">Masukkan Data Dengan Benar</span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full mt-4 gap-4">
                {Object.entries(prosesPraktikumData as Record<string, Record<string, { praktikum?: string; jenisNilai?: string; nilai: string }>>).map(
                  ([praktikumKey, jenisNilaiObj]) =>
                    Object.entries(jenisNilaiObj).map(
                      ([jenisNilaiKey, data]) => (
                        <div
                          key={`${praktikumKey}-${jenisNilaiKey}`}
                          className="flex items-center gap-4"
                        >
                          <div className="flex flex-col w-full gap-3">
                            <Label>Nama Praktikum</Label>
                            <Input value={data.praktikum} readOnly />
                          </div>

                          <div className="flex flex-col w-full gap-3">
                            <Label>Jenis Nilai</Label>
                            <Input value={data.jenisNilai} readOnly />
                          </div>

                          <FormField
                            control={form.control}
                            name={`prosesPraktikumNilai.${praktikumKey}.${jenisNilaiKey}.nilai`}
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Nilai</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Masukkan nilai"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )
                    )
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Batalkan
              </Button>
              <Button type="submit" variant="blue" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NimInputPenilaian;
