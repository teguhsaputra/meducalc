"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { HasilPenilaianModulListing } from "@/features/admin/hasil-penilaian/hasil-penilaian-modul-listing";
import { SlugListingHasilPenilaian } from "@/features/admin/hasil-penilaian/slug-listing-hasil/slug-listing-hasil-penilaian";
import { SlugListing } from "@/features/admin/input-penilaian/slug-listing/slug-listing";
import { useGetModulDetailHasilPenilaian } from "@/services/api/hasil-penilaian";
import { useGetModulDetailForPesertaPenilaianModul } from "@/services/api/penilaian-modul";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";

type PageProps = { params: { slug: string } };

const Page = ({ params }: PageProps) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchSiswa, setSearchSiswa] = useState("");
  const [searchNim, setSearchNim] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [tingkatFilter, setTingkatFilter] = useState<
    "A" | "B" | "C" | "D" | "E" | ""
  >("");
  const cleanedSlug = decodeURIComponent(params.slug);

  const { data, currentPage, totalPages, totalItems, itemsPerPage, isPending } =
    useGetModulDetailHasilPenilaian(
      pageIndex,
      pageSize,
      cleanedSlug,
      searchSiswa,
      searchNim,
      sortOrder,
      tingkatFilter
    );
  const router = useRouter();

  const nilaiStats = useMemo(() => {
    const stats = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    if (data) {
      data.forEach((item: any) => {
        const tingkat = item.tingkat_akhir as keyof typeof stats;
        stats[tingkat]++;
      });
    }
    return stats;
  }, [data]);

  const handleNextPage = useCallback(() => {
    if (data?.pagination.page < data?.pagination.totalPages) {
      setPageIndex(pageIndex + 1);
    }
  }, [data, pageIndex]);

  const handlePrevPage = useCallback(() => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  }, [pageIndex]);

  const handleSearch = useCallback(
    (newSearchSiswa: string, newSearchNim: string) => {
      setSearchSiswa(newSearchSiswa);
      setSearchNim(newSearchNim);
      setPageIndex(0);
    },
    []
  );

  const handleSortOrderChange = useCallback((newSortOrder: "asc" | "desc") => {
    setSortOrder(newSortOrder);
    setPageIndex(0);
  }, []);

  const handleTingkatFilterChange = useCallback(
    (newTingkat: "A" | "B" | "C" | "D" | "E" | "") => {
      setTingkatFilter(newTingkat);
      setPageIndex(0);
    },
    []
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-bold">{cleanedSlug}</h3>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex flex-col">
            <span className="text-sm">Nilai A</span>
            <span className="font-bold text-sm">{nilaiStats.A} Siswa</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm">Nilai B</span>
            <span className="font-bold text-sm">{nilaiStats.B} Siswa</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm">Nilai C</span>
            <span className="font-bold text-sm">{nilaiStats.C} Siswa</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm">Nilai D</span>
            <span className="font-bold text-sm">{nilaiStats.D} Siswa</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm">Nilai E</span>
            <span className="font-bold text-sm">{nilaiStats.E} Siswa</span>
          </div>
        </div>
      </div>

      <Separator className="h-0.5 rounded-full my-6" />

      <div className="mt-7">
        <SlugListingHasilPenilaian
          data={data}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          isLoading={isPending}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          onSortOrderChange={handleSortOrderChange}
          onTingkatFilterChange={handleTingkatFilterChange}
          onSearch={handleSearch}
          searchSiswa={searchSiswa}
          searchNim={searchNim}
          sortOrder={sortOrder}
          tingkatFilter={tingkatFilter}
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
