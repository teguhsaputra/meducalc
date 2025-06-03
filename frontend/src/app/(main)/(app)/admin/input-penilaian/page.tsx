"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { InputPenilaianListing } from "@/features/admin/input-penilaian/input-penilaian-listing";
import { SearchModul } from "@/features/modul/components/search-modul";
import { SearchSchoolYear } from "@/features/modul/components/search-school-year";
import { useGetModulForPenilaianModul } from "@/services/api/penilaian-modul";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";

export const dynamic = "force-static";

const Page = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchModul, setSearchModul] = useState("");
  const [searchSchoolYear, setSearchSchoolYear] = useState("");
  const { data, currentPage, totalPages, totalItems, itemsPerPage, isPending } =
    useGetModulForPenilaianModul(
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

  return (
    <div className="flex flex-col">
      <div className="flex ">
        <span className="text-3xl font-semibold">Input Penilaian Modul</span>
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
          <InputPenilaianListing
            data={data}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onNextPage={() => handleNextPage()}
            onPrevPage={() => handlePrevPage()}
            isLoading={isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
