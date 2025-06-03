"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DosenListing } from "@/features/dosen/dosen-listing";
import { useGetDosenModul } from "@/services/api/dosen";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";

export const dynamic = "force-static";

const Page = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const { data, currentPage, totalPages, totalItems, itemsPerPage, isPending } =
    useGetDosenModul(pageIndex, pageSize, search);

  const mappedData = (data?.data || []).map((item: any) => ({
    id: item.modul_id,
    nama_dosen: item.nama_dosen,
    total_modul: item.total_modul,
  }));

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setPageIndex(0);
    },
    [setSearch, setPageIndex]
  );

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setPageIndex(pageIndex + 1);
    }
  }, [currentPage, totalItems, pageIndex, setPageIndex]);

  const handlePrevPage = useCallback(() => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  }, [pageIndex, setPageIndex]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-semibold">Dokter</span>
        <Link href="/admin/dosen/tambah-dosen">
          <Button variant="blue">
            Tambah Dosen <Plus className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <Separator className="h-0.5 rounded-full my-6" />

      <div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col w-full space-y-2">
            <Label>Nama Dosen</Label>
            <Input value={search} onChange={handleSearchChange} />
          </div>
          <Button className="mt-5" onClick={() => setPageIndex(0)}>
            Cari Data
          </Button>
        </div>

        <div className="mt-7">
          <DosenListing
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
      </div>
    </div>
  );
};

export default Page;
