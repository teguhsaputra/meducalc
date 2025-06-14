"use client";

import StepsSesiPenilaian from "@/components/steps-sesi-penilaian";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import AlertModalNilaiPraktikum from "@/features/modul/components/alert-modal-nilai-praktikum";
import { SearchModul } from "@/features/modul/components/search-modul";
import { SearchSchoolYear } from "@/features/modul/components/search-school-year";
import ModulListing from "@/features/modul/modul-listing";
import { useToast } from "@/hooks/use-toast";
import { withAuth } from "@/hooks/with-auth";
import { formatDate } from "@/lib/utils";
import { useGetModul } from "@/services/api/modul";
import { useGetSesiPenilaian } from "@/services/api/sesi-penilaian";
import { Plus } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export const dynamic = "force-static";

const Page = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [tahunAjaran, setTahunAjaran] = useState("");
  const {
    data: dataModul,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    isPending,
  } = useGetModul(pageIndex, 10, searchQuery);
  const { data } = useGetSesiPenilaian();
  const { toast } = useToast();
  const hasShownToast = useRef(false);

  const handleSearch = () => {
    const query = tahunAjaran
      ? `${searchInput} ${tahunAjaran}`.trim()
      : searchInput;
    setSearchQuery(query);
    setPageIndex(0);
  };

  const handleNextPage = () => {
    if (totalPages && pageIndex + 1 < totalPages) {
      const newPageIndex = pageIndex + 1;
      setPageIndex(newPageIndex);
      console.log("Page: New pageIndex:", newPageIndex); // Debugging
    }
  };

  const handlePrevPage = () => {
    if (pageIndex > 0) {
      const newPageIndex = pageIndex - 1;
      setPageIndex(newPageIndex);
      console.log("Page: New pageIndex:", newPageIndex); // Debugging
    }
  };

  useEffect(() => {
    if (data?.message && !hasShownToast.current) {
      toast({
        description: data.message,
        variant: data.isActive ? "success" : "destructive",
        duration: 10000,
      });
      hasShownToast.current = true;
    }
  }, [data, toast]); // Hanya trigger ketika sesiData atau toast berubah

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
            <span className="text-sm font-bold">
              {formatDate(data?.data?.sesi_mulai)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm">
              Sesi Penilaian Terakhir Dinonaktifkan
            </span>
            <span className="text-sm font-bold">
              {formatDate(data?.data?.sesi_selesai)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm">Total Modul</span>
            <span className="text-sm font-bold">{totalItems}</span>
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-between pb-8">
        <div className="flex items-center space-x-10">
          <span className="text-3xl font-bold -mt-3">Modul</span>

          <div className="flex flex-col">
            <span className="text-sm">Sesi Penilaian Terakhir Diaktifkan</span>
            <span className="text-sm font-bold">
              {formatDate(data?.data?.sesi_mulai)}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm">
              Sesi Penilaian Terakhir Dinonaktifkan
            </span>
            <span className="text-sm font-bold">
              {formatDate(data?.data?.sesi_selesai)}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm">Total Modul</span>
            <span className="text-sm font-bold">{totalItems}</span>
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
              value={searchInput}
              onChange={setSearchInput}
              search={searchInput}
            />
          </div>
          <div className="w-full md:w-1/2">
            <span className="text-base font-medium mb-1 block">
              Tahun Ajaran
            </span>
            <SearchSchoolYear
              value={tahunAjaran}
              onChange={setTahunAjaran}
              search={searchInput}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2 mt-4 md:mt-7 w-full md:w-auto">
          <Button
            className="bg-[#0F172A] hover:bg-[#0F172A] whitespace-nowrap"
            onClick={handleSearch}
            disabled={!searchInput && !tahunAjaran}
          >
            Cari Data
          </Button>

          <StepsSesiPenilaian />
        </div>
      </div>

      {isPending ? (
        <div className="pt-6">
          <DataTableSkeleton columnCount={8} rowCount={10} filterCount={2} />
        </div>
      ) : (
        <div className="pt-6">
          <ModulListing
            search={searchQuery}
            setSearch={setSearchQuery}
            data={dataModul}
            isPending={isPending}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
          />
        </div>
      )}
    </div>
  );
};

export default withAuth(Page);
