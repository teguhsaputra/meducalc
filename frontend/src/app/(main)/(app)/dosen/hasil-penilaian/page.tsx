"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DosenModulListing } from "@/features/dosen/user-dosen/modul/dosen-modul-listing";
import { SearchModul } from "@/features/modul/components/search-modul";
import { SearchSchoolYear } from "@/features/modul/components/search-school-year";
import { useGetModulDosen } from "@/services/api/dosen";
import React, { useCallback, useState } from "react";

const Page = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchModul, setSearchModul] = useState("");
  const [searchSchoolYear, setSearchSchoolYear] = useState("");
  const { data, currentPage, totalPages, totalItems, itemsPerPage, isPending } =
    useGetModulDosen(pageIndex, pageSize, searchModul, searchSchoolYear);

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
      <h2 className="text-3xl font-bold">Penilaian Dosen</h2>

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
          <DosenModulListing
            data={data}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            isLoading={isPending}
            onNextPage={() => handleNextPage()}
            onPrevPage={() => handlePrevPage()}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
