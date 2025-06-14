"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AdminMahasiswaListing } from "@/features/mahasiswa/admin/admin-mahasiswa-listing";
import { Plus } from "lucide-react";
import { useGetModulDetailForPesertaPenilaianModul } from "@/services/api/penilaian-modul";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useGetAllMahasiswa } from "@/services/api/mahasiswa";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { withAuth } from "@/hooks/with-auth";

export const dynamic = "force-static";

const Page = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [inputSiswa, setInputSiswa] = useState("");
  const [inputNim, setInputNim] = useState("");
  const [inputAngkatan, setInputAngkatan] = useState("");
  const [searchSiswa, setSearchSiswa] = useState("");
  const [searchNim, setSearchNim] = useState("");
  const [searchAngkatan, setSearchAngkatan] = useState("");

  const {
    data,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    isPending,
    refetch,
  } = useGetAllMahasiswa(
    pageIndex,
    pageSize,
    searchSiswa,
    searchNim,
    searchAngkatan
  );
  const router = useRouter();

  console.log("Data from useGetAllMahasiswa:", data);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setPageIndex(pageIndex + 1);
    }
  }, [currentPage, totalPages, pageIndex]);

  const handlePrevPage = useCallback(() => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  }, [pageIndex, setPageIndex]);

  const handleSearch = () => {
    setPageIndex(0);
    setSearchSiswa(inputSiswa);
    setSearchNim(inputNim);
    setSearchAngkatan(inputAngkatan);
    console.log("Search Params:", {
      searchSiswa: inputSiswa,
      searchNim: inputNim,
      searchAngkatan: inputAngkatan,
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <h3 className="text-3xl font-bold">Mahasiswa</h3>
        <Button
          variant="blue"
          onClick={() => router.push("/admin/mahasiswa/tambah-mahasiswa")}
        >
          Tambah Mahasiswa
          <Plus className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <Separator className="h-0.5 rounded-full my-6" />

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
        <div className="flex flex-col w-full">
          <span className="text-base font-medium mb-1">Nama Siswa</span>
          <Input
            value={inputSiswa}
            onChange={(e) => setInputSiswa(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-full">
          <span className="text-base font-medium mb-1">NIM</span>
          <Input
            value={inputNim}
            onChange={(e) => setInputNim(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-full">
          <span className="text-base font-medium mb-1">Angkatan</span>
          <Input
            value={inputAngkatan}
            onChange={(e) => setInputAngkatan(e.target.value)}
          />
        </div>
        <Button
          className="bg-[#0F172A] hover:bg-[#0F172A] w-full md:w-auto"
          onClick={handleSearch}
        >
          Cari Data
        </Button>
      </div>

      {isPending ? (
        <div className="mt-7">
          <DataTableSkeleton columnCount={6} rowCount={10} filterCount={2} />
        </div>
      ) : (
        <div className="mt-7">
          <AdminMahasiswaListing
            data={data}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            isLoading={isPending}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
          />
        </div>
      )}
    </div>
  );
};

export default withAuth(Page);
