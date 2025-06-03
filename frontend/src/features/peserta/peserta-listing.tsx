"use client";

import React, { useState } from "react";
import { useGetMahasiswa } from "@/services/api/mahasiswa";
import { columnsPeserta } from "./components/column";
import { DataTable } from "./components/data-table";

interface Peserta {
  id: string;
  nama_siswa: string;
  nim: number;
  angkatan: number;
  username: string;
}

interface PesertaListingProps {
  onSelectionChange: (selected: Peserta[]) => void;
}

export default function PesertaListing({
  onSelectionChange,
}: PesertaListingProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const { data, pagination, isPending } = useGetMahasiswa(
    pageIndex,
    pageSize,
    search
  );

  return (
    <DataTable
      data={data}
      columns={columnsPeserta}
      pageCount={pagination.totalPages}
      pageIndex={pageIndex}
      pageSize={pageSize}
      onPageChange={(newPageIndex) => setPageIndex(newPageIndex)}
      onPageSizeChange={setPageSize}
      onSelectionChange={onSelectionChange}
    />
  );
}
