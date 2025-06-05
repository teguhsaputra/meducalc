"use client";

import StepsSesiPenilaian from "@/components/steps-sesi-penilaian";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AlertModalNilaiPraktikum from "@/features/modul/components/alert-modal-nilai-praktikum";
import { SearchModul } from "@/features/modul/components/search-modul";
import { SearchSchoolYear } from "@/features/modul/components/search-school-year";
import ModulListing from "@/features/modul/modul-listing";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

export const dynamic = "force-static";

const Page = () => {
  return (
    <div className="flex flex-col w-full h-full ">
      <div className="flex items-center justify-between md:hidden pb-8">
        <div className="flex items-center space-x-6">
          <span className="text-3xl font-bold -mt-3">Modul</span>
        </div>
        <div>
          <AlertModalNilaiPraktikum />
        </div>
      </div>

      <div className="flex flex-col space-y-4 md:hidden mb-6">
        <div className="flex justify-between">
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
      </div>

      <div className="hidden md:flex items-center justify-between pb-8">
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

        <AlertModalNilaiPraktikum />
      </div>

      <Separator className="h-0.5 rounded-full" />

      <div className="flex flex-col md:flex-row items-start md:items-center pt-8 gap-6">
        <div className="flex flex-col md:flex-row md:items-center w-full gap-4 md:gap-8">
          <div className="w-full md:w-1/2">
            <span className="text-base font-medium mb-1 block">Nama modul</span>
            <SearchModul
              value={""}
              onChange={function (value: string): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
          <div className="w-full md:w-1/2">
            <span className="text-base font-medium mb-1 block">
              Tahun Ajaran
            </span>
            <SearchSchoolYear
              value={""}
              onChange={function (value: string): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2 mt-4 md:mt-7 w-full md:w-auto">
          <Button className="bg-[#0F172A] hover:bg-[#0F172A] whitespace-nowrap">
            Cari Data
          </Button>

          <StepsSesiPenilaian />
        </div>
      </div>

      <div className="pt-6">
        <ModulListing />
      </div>
    </div>
  );
};

export default Page;
