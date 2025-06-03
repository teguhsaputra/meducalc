import StepsSesiPenilaian from "@/components/steps-sesi-penilaian";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SearchModul } from "@/features/modul/components/search-modul";
import { SearchSchoolYear } from "@/features/modul/components/search-school-year";
import ModulListing from "@/features/modul/modul-listing";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

export const dynamic = "force-static";

const Page = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between pb-8">
        <div className="flex items-center space-x-10">
          <span className="text-3xl font-bold -mt-3">Modul</span>
          <div className="flex flex-col">
            <span className="text-sm">Sesi Penilaian Terakhir Diaktifkan</span>
            <span className="text-sm font-bold">10 Juni 2024</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm">
              Sesi Penilaian Terakhir Dinonaktifkan
            </span>
            <span className="text-sm font-bold">20 Juni 2024</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm">Total Modul</span>
            <span className="text-sm font-bold">2</span>
          </div>
        </div>
        <Link href="/admin/modul/tambah-modul">
          <Button className="bg-[#2262C6] hover:bg-blue-600">
            <span>Tambah Modul</span>
            <Plus className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <Separator className="h-0.5 rounded-full" />

      <div className="flex items-center pt-8">
        <div className="flex flex-col w-full">
          <span className="text-base font-medium mb-1">Nama modul</span>
          {/* <SearchModul /> */}
        </div>
        <div className="flex flex-col w-full ml-8">
          <span className="text-base font-medium mb-1">Tahun Ajaran</span>
          {/* <SearchSchoolYear /> */}
        </div>
        <Button className="mt-7 bg-[#0F172A] hover:bg-[#0F172A] ml-2">
          Cari Data
        </Button>
        {/* <Button className="mt-7 bg-[#2262C6] hover:bg-blue-600 ml-2">
          Aktif Sesi Pelatihan
        </Button> */}
        <StepsSesiPenilaian />
      </div>

      <div className="pt-6">
        <ModulListing />
      </div>
    </div>
  );
};

export default Page;
