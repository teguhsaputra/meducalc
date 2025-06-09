"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SlugListing } from "@/features/admin/input-penilaian/slug-listing/slug-listing";
import { useGetModulDetailForPesertaPenilaianModul } from "@/services/api/penilaian-modul";
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
    useGetModulDetailForPesertaPenilaianModul(
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
      <h3 className="text-2xl md:text-3xl font-bold">
        Penilaian Modul {cleanedSlug}
      </h3>

      <Separator className="h-0.5 rounded-full my-6" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <div className="flex flex-col w-full">
          <span className="text-base font-medium mb-1">Nama Siswa</span>
          <Input
            value={searchSiswa}
            onChange={(e) => setSearchSiswa(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-col w-full ">
          <span className="text-base font-medium mb-1">NIM</span>
          <Input
            value={searchNim}
            onChange={(e) => setSearchNim(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-col w-full ">
          <span className="text-base font-medium mb-1">Angkatan</span>
          <Input
            value={searchAngkatan}
            onChange={(e) => setSearchAngkatan(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full">
          <Button
            className="mt-7 bg-[#0F172A] hover:bg-[#0F172A] "
            onClick={handleSearch}
          >
            Cari Data
          </Button>
        </div>
      </div>

      <div className="mt-7">
        <SlugListing
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

      <div className="flex justify-end mt-10">
        <Button variant="blue" onClick={() => router.back()}>
          Kembali
        </Button>
      </div>
    </div>
  );
};

export default Page;
