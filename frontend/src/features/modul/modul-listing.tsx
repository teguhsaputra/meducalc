"use client";

import React, { useState } from "react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { useGetModul } from "@/services/api/modul";

interface ModulListingProps {
  search: string; // Terima search sebagai prop
  setSearch?: (value: string) => void; // Opsional: untuk memperbarui search
  data: any[]; // Data dari useGetModul di Page
  pagination: any; // Pagination dari useGetModul di Page
  isPending: boolean; // Status loading
}

export default function ModulListing({
  search,
  setSearch,
  data,
  pagination,
  isPending,
}: ModulListingProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  return (
    <DataTable
      data={data}
      columns={columns}
      pageCount={pagination.totalPages}
      pageIndex={pageIndex}
      pageSize={pageSize}
      onPageChange={(newPageIndex) => setPageIndex(newPageIndex)}
      onPageSizeChange={setPageSize}
    />
  );
}
