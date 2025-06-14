"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { DosenModulListing } from "@/features/dosen/user-dosen/modul/dosen-modul-listing";
import { SearchModul } from "@/features/modul/components/search-modul";
import { SearchSchoolYear } from "@/features/modul/components/search-school-year";
import { withAuth } from "@/hooks/with-auth";
import { useGetModulDosen } from "@/services/api/dosen";
import React, { useCallback, useState } from "react";

const Page = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [tahunAjaran, setTahunAjaran] = useState("");
  const [searchSchoolYear, setSearchSchoolYear] = useState("");
  const { data, currentPage, totalPages, totalItems, itemsPerPage, isPending } =
    useGetModulDosen(pageIndex, pageSize, searchQuery, searchSchoolYear);

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

  const handleSearch = () => {
    const query = tahunAjaran
      ? `${searchInput} ${tahunAjaran}`.trim()
      : searchInput;
    setSearchQuery(query);
    setPageIndex(0);
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-3xl font-bold">Modul Dosen</h2>

      <Separator className="h-0.5 rounded-full my-6" />

      <div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col w-full">
            <span className="text-base font-medium mb-1">Nama modul</span>
            <SearchModul
              value={searchInput}
              onChange={setSearchInput}
              search={searchInput}
            />
          </div>
          <div className="flex flex-col w-full">
            <span className="text-base font-medium mb-1">Tahun Ajaran</span>
            <SearchSchoolYear
              value={searchSchoolYear}
              onChange={setSearchSchoolYear}
              search={searchInput}
            />
          </div>
          <Button
            className="mt-7 bg-[#0F172A] hover:bg-[#0F172A] "
            onClick={handleSearch}
            disabled={!searchInput && !searchSchoolYear}
          >
            Cari Data
          </Button>
        </div>

        {isPending ? (
          <div className="mt-7">
            <DataTableSkeleton columnCount={5} rowCount={10} filterCount={2} />
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default withAuth(Page);
