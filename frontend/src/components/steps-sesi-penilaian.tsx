"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { addMinutes, format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  useGetSesiPenilaian,
  useSesiPenilaian,
} from "@/services/api/sesi-penilaian";

const STEPS = [
  {
    name: "Apakah anda yakin mengaktifkan sesi penilaian?",
    description:
      "Tindakan ini tidak dapat dibatalkan. Pastikan waktu yang ditentukan telah dikonfirmasi.",
  },
  {
    name: "Pilih Tanggal - Waktu Mulai dan Selesai",
    description:
      "Tindakan ini tidak dapat dibatalkan. Pastikan waktu yang ditentukan telah dikonfirmasi.",
  },
  {
    name: "Apakah anda sudah yakin dengan data berikut?",
    description:
      "Tindakan ini tidak dapat dibatalkan. Pastikan waktu yang ditentukan telah dikonfirmasi.",
  },
  {
    name: "Peringatan Terakhir!",
    description:
      "Tindakan ini tidak dapat dibatalkan. Klik 'Aktifkan' untuk memulai sesi penilaian.",
  },
];

const FormSchema = z
  .object({
    datetimeStart: z
      .date({
        required_error: "Tanggal & waktu mulai wajib diisi!",
        invalid_type_error: "Format tanggal tidak valid.",
      })
      .refine((date) => !isNaN(date.getTime()), {
        message: "Tanggal tidak valid.",
      }),
    datetimeEnd: z
      .date({
        required_error: "Tanggal & waktu selesai wajib diisi!",
        invalid_type_error: "Format tanggal tidak valid.",
      })
      .refine((date) => !isNaN(date.getTime()), {
        message: "Tanggal tidak valid.",
      }),
  })
  .refine((data) => data.datetimeEnd > data.datetimeStart, {
    message: "Waktu selesai harus setelah waktu mulai.",
    path: ["datetimeEnd"],
  });

export default function StepsSesiPenilaian() {
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [timeStart, setTimeStart] = useState<string>("00:00");
  const [timeEnd, setTimeEnd] = useState<string>("00:00");
  const [dateStart, setDateStart] = useState<Date | null>(null);
  const [dateEnd, setDateEnd] = useState<Date | null>(null);
  const { data } = useGetSesiPenilaian();
  const { mutate, isPending } = useSesiPenilaian();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      datetimeStart: new Date(),
      datetimeEnd: addMinutes(new Date(), 30),
    },
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  const handleClose = () => {
    setOpen(false);
    setStep(0);
    form.reset();
  };

  const isLastStep = step === STEPS.length - 1;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const sesiMulai = data.datetimeStart.toISOString();
    const sesiSelesai = data.datetimeEnd.toISOString();
    mutate({ action: "activate", sesiMulai, sesiSelesai });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="ml-2 bg-blue-600 hover:bg-blue-700">
          Aktifkan Sesi Penilaian
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{STEPS[step].name}</AlertDialogTitle>
          <AlertDialogDescription>
            {STEPS[step].description}
          </AlertDialogDescription>
          {step === 1 && (
            <div className="flex flex-col">
              <span className="py-3 text-base font-semibold">
                Pilih Waktu Mulai
              </span>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="flex w-full gap-4">
                    <FormField
                      control={form.control}
                      name="datetimeStart"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                          <FormLabel>Tanggal Mulai</FormLabel>
                          <Popover modal={true}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    `${format(
                                      field.value,
                                      "PPP"
                                    )}, ${timeStart}`
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-full p-0 z-[100]"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={dateStart || field.value}
                                onSelect={(selectedDate) => {
                                  const [hours, minutes] = timeStart.split(":");
                                  const newDate = selectedDate
                                    ? new Date(selectedDate)
                                    : new Date();
                                  newDate.setHours(
                                    parseInt(hours),
                                    parseInt(minutes),
                                    0,
                                    0
                                  );
                                  setDateStart(newDate);
                                  field.onChange(newDate);
                                }}
                                onDayClick={() => setIsOpen(false)}
                                fromYear={2000}
                                toYear={new Date().getFullYear() + 1}
                                defaultMonth={field.value}
                                disabled={
                                  (date) =>
                                    date <
                                    new Date(
                                      new Date().getTime() - 24 * 60 * 60 * 1000
                                    ) // Disable tanggal sebelum 24 jam lalu
                                }
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="datetimeStart"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                          <FormLabel>Waktu Mulai</FormLabel>
                          <FormControl>
                            <Select
                              defaultValue={timeStart}
                              onValueChange={(e) => {
                                setTimeStart(e);
                                const [hours, minutes] = e.split(":");
                                const newDate = dateStart
                                  ? new Date(dateStart)
                                  : new Date(field.value);
                                newDate.setHours(
                                  parseInt(hours),
                                  parseInt(minutes),
                                  0,
                                  0
                                );
                                setDateStart(newDate);
                                field.onChange(newDate);
                              }}
                            >
                              <SelectTrigger className="font-normal focus:ring-0 w-full focus:ring-offset-0">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <ScrollArea className="h-[15rem]">
                                  {Array.from({ length: 96 }).map((_, i) => {
                                    const hour = Math.floor(i / 4)
                                      .toString()
                                      .padStart(2, "0");
                                    const minute = ((i % 4) * 15)
                                      .toString()
                                      .padStart(2, "0");
                                    return (
                                      <SelectItem
                                        key={i}
                                        value={`${hour}:${minute}`}
                                      >
                                        {hour}:{minute}
                                      </SelectItem>
                                    );
                                  })}
                                </ScrollArea>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <span className="text-base font-semibold py-3">
                      Pilih Waktu Selesai
                    </span>
                    <div className="flex w-full gap-4 pt-3">
                      <FormField
                        control={form.control}
                        name="datetimeEnd"
                        render={({ field }) => (
                          <FormItem className="flex flex-col w-full">
                            <FormLabel>Tanggal Selesai</FormLabel>
                            <Popover modal={true}>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      `${format(
                                        field.value,
                                        "PPP"
                                      )}, ${timeEnd}`
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-full p-0 z-[100]"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={dateEnd || field.value}
                                  onSelect={(selectedDate) => {
                                    const [hours, minutes] = timeEnd.split(":");
                                    const newDate = selectedDate
                                      ? new Date(selectedDate)
                                      : new Date();
                                    newDate.setHours(
                                      parseInt(hours),
                                      parseInt(minutes),
                                      0,
                                      0
                                    );
                                    setDateEnd(newDate);
                                    field.onChange(newDate);
                                  }}
                                  onDayClick={() => setIsOpen(false)}
                                  fromYear={2000}
                                  toYear={new Date().getFullYear() + 1}
                                  defaultMonth={field.value}
                                  disabled={(date) =>
                                    date <
                                    new Date(
                                      new Date().getTime() - 24 * 60 * 60 * 1000
                                    )
                                  }
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="datetimeEnd"
                        render={({ field }) => (
                          <FormItem className="flex flex-col w-full">
                            <FormLabel>Waktu Selesai</FormLabel>
                            <FormControl>
                              <Select
                                defaultValue={timeEnd}
                                onValueChange={(e) => {
                                  setTimeEnd(e);
                                  const [hours, minutes] = e.split(":");
                                  const newDate = dateEnd
                                    ? new Date(dateEnd)
                                    : new Date(field.value);
                                  newDate.setHours(
                                    parseInt(hours),
                                    parseInt(minutes),
                                    0,
                                    0
                                  );
                                  setDateEnd(newDate);
                                  field.onChange(newDate);
                                }}
                              >
                                <SelectTrigger className="font-normal focus:ring-0 w-full focus:ring-offset-0">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <ScrollArea className="h-[15rem]">
                                    {Array.from({ length: 96 }).map((_, i) => {
                                      const hour = Math.floor(i / 4)
                                        .toString()
                                        .padStart(2, "0");
                                      const minute = ((i % 4) * 15)
                                        .toString()
                                        .padStart(2, "0");
                                      return (
                                        <SelectItem
                                          key={i}
                                          value={`${hour}:${minute}`}
                                        >
                                          {hour}:{minute}
                                        </SelectItem>
                                      );
                                    })}
                                  </ScrollArea>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col mt-5">
              <div>
                <span className="font-semibold text-black text-base">
                  Sesi Penilaian Akan Dimulai Pada Tanggal:
                </span>
                <span className="flex gap-2 mt-1">
                  <span className="font-bold text-gray-900 text-base">
                    {form.watch("datetimeStart")
                      ? format(form.watch("datetimeStart"), "d MMMM yyyy")
                      : "Belum dipilih"}
                  </span>
                  <span>Pukul</span>
                  <span className="font-bold text-gray-900 text-base">
                    {form.watch("datetimeStart")
                      ? format(form.watch("datetimeStart"), "HH:mm") + " WIB"
                      : "Belum dipilih"}
                  </span>
                </span>
              </div>
              <div className="mt-2">
                <span className="font-semibold text-black text-base mt-2">
                  Sesi Penilaian Akan Selesai Pada Tanggal:
                </span>
                <span className="flex gap-2 mt-1">
                  <span className="font-bold text-gray-900 text-base">
                    {form.watch("datetimeEnd")
                      ? format(form.watch("datetimeEnd"), "d MMMM yyyy")
                      : "Belum dipilih"}
                  </span>
                  <span>Pukul</span>
                  <span className="font-bold text-gray-900 text-base">
                    {form.watch("datetimeEnd")
                      ? format(form.watch("datetimeEnd"), "HH:mm") + " WIB"
                      : "Belum dipilih"}
                  </span>
                </span>
              </div>

              <div className="mt-3">
                <p className="text-sm">
                  Pastikan waktu yang dimasukkan benar-benar valid. Karena
                  setelah aktif waktu tidak dapat diubah atau dihentikan.
                </p>
              </div>
            </div>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          {step === 0 && (
            <AlertDialogCancel onClick={handleClose}>
              Batalkan
            </AlertDialogCancel>
          )}

          {step > 0 && (
            <Button variant="outline" onClick={handleBack}>
              Kembali
            </Button>
          )}

          {step === 2 ? (
            <Button onClick={handleNext} variant="blue" disabled={isPending}>
              {isPending ? "Memproses..." : "Saya Telah Yakin dan Lanjutkan"}
            </Button>
          ) : !isLastStep ? (
            <Button onClick={handleNext} variant="blue">
              Lanjutkan
            </Button>
          ) : (
            <AlertDialogAction
              className="bg-[#2262C6] hover:bg-blue-600"
              onClick={() => {
                form.handleSubmit(onSubmit)();
              }}
              disabled={isPending}
            >
              {isPending ? "Memproses..." : "Aktifkan Sesi Penilaian"}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
