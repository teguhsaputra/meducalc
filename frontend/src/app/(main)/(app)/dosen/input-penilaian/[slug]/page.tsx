"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { SlugModulDosenPenilaianListing } from "@/features/dosen/user-dosen/components/slug-modul-dosen-penilaian-listing";
import { withAuth } from "@/hooks/with-auth";
import { useGetModulDosenDetailForPesertaPenilaianModul } from "@/services/api/dosen";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";

type PageProps = { params: { slug: string } };

const Page = ({ params }: PageProps) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchSiswa, setSearchSiswa] = useState("");
  const [searchNim, setSearchNim] = useState("");
  const [searchAngkatan, setSearchAngkatan] = useState("");
  const cleanedSlug = decodeURIComponent(params.slug);

  const { data, currentPage, totalPages, totalItems, itemsPerPage, isPending } =
    useGetModulDosenDetailForPesertaPenilaianModul(
      pageIndex,
      pageSize,
      cleanedSlug,
      searchSiswa,
      searchNim,
      searchAngkatan
    );
  const router = useRouter();

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
    setPageIndex(0);
  };

  return (
    <div>
      <h3 className="text-3xl font-bold">Penilaian Modul {cleanedSlug}</h3>

      <Separator className="h-0.5 rounded-full my-6" />

      <div className="flex items-center">
        <div className="flex flex-col w-full">
          <span className="text-base font-medium mb-1">Nama Siswa</span>
          <Input
            value={searchSiswa}
            onChange={(e) => setSearchSiswa(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-full ml-8">
          <span className="text-base font-medium mb-1">NIM</span>
          <Input
            value={searchNim}
            onChange={(e) => setSearchNim(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-full ml-8">
          <span className="text-base font-medium mb-1">Angkatan</span>
          <Input
            value={searchAngkatan}
            onChange={(e) => setSearchAngkatan(e.target.value)}
          />
        </div>
        <Button
          className="mt-7 bg-[#0F172A] hover:bg-[#0F172A] ml-2"
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
          <SlugModulDosenPenilaianListing
            data={data}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            isLoading={isPending}
            onNextPage={() => handleNextPage()}
            onPrevPage={() => handlePrevPage()}
            slug={cleanedSlug}
          />
        </div>
      )}

      <div className="flex justify-end mt-10">
        <Button variant="blue" onClick={() => router.back()}>
          Kembali
        </Button>
      </div>
    </div>
  );
};

export default withAuth(Page);
