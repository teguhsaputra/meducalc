"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const AlertModalNilaiPraktikum = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="bg-[#2262C6] hover:bg-blue-600 flex items-center gap-2 h-9 px-4 py-2 whitespace-nowrap rounded-md text-sm font-medium text-white">
        <span>Tambah Modul</span>
        <Plus className="w-4 h-4" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="text-left gap-y-3">
          <AlertDialogTitle>
            Apakah Modul Memiliki Nilai Praktikum?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan setelah modul dibuat, Pastikan
            semua data benar.
          </AlertDialogDescription>
          <div className="w-full">
            <RadioGroup defaultValue="option-one" className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-one" id="option-one" />
                <Label htmlFor="option-one">Tidak ada Praktikum</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-two" id="option-two" />
                <Label htmlFor="option-two">Ya Terdapat Praktikum</Label>
              </div>
            </RadioGroup>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batalkan</AlertDialogCancel>
          <AlertDialogAction className="bg-[#2262C6] hover:bg-blue-600">
            <Link href={"/admin/modul/tambah-modul"}>Lanjutkan</Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertModalNilaiPraktikum;
