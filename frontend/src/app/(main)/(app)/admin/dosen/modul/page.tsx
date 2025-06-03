"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DosenListing } from "@/features/dosen/dosen-listing";
import { ModulDosenListing } from "@/features/dosen/modul/modul-dosen-listing";
import { SearchModul } from "@/features/modul/components/search-modul";
import { SearchSchoolYear } from "@/features/modul/components/search-school-year";
import { useGetModulByDosen } from "@/services/api/dosen";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useState } from "react";

export const dynamic = "force-dynamic";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const penanggungJawab = searchParams.get("penanggungJawab") || "";
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchModul, setSearchModul] = useState("");
  const [searchSchoolYear, setSearchSchoolYear] = useState("");
  const { data, currentPage, totalPages, totalItems, itemsPerPage, isPending } =
    useGetModulByDosen(
      penanggungJawab,
      pageIndex,
      pageSize,
      searchModul,
      searchSchoolYear
    );

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setPageIndex(pageIndex + 1);
    }
  }, [currentPage, totalPages, pageIndex, setPageIndex]);

  const handlePrevPage = useCallback(() => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  }, [pageIndex, setPageIndex]);

  const mappedData = (data || []).map((item: any) => ({
    id: item.id,
    nama_modul: item.nama_modul,
    tahun_ajaran: item.tahun_ajaran,
    total_siswa: item.total_siswa,
  }));

  console.log("mapped data", mappedData);

  return (
    <div className="flex flex-col">
      <div className="flex ">
        <span className="text-3xl font-semibold">Modul Dosen</span>
      </div>

      <Separator className="h-0.5 rounded-full my-6" />

      <div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col w-full">
            <span className="text-base font-medium mb-1">Nama modul</span>
            <SearchModul value={searchModul} onChange={setSearchModul} />
          </div>
          <div className="flex flex-col w-full">
            <span className="text-base font-medium mb-1">Tahun Ajaran</span>
            <SearchSchoolYear
              value={searchSchoolYear}
              onChange={setSearchSchoolYear}
            />
          </div>
          <Button className="mt-7 bg-[#0F172A] hover:bg-[#0F172A] ">
            Cari Data
          </Button>
        </div>

        <div className="mt-7">
          <ModulDosenListing
            data={mappedData}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onNextPage={() => handleNextPage()}
            onPrevPage={() => handlePrevPage()}
            isLoading={isPending}
          />
        </div>

        <div className="flex justify-end mt-10">
          <Button variant="blue" onClick={() => router.back()}>
            Kembali
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
