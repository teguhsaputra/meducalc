"use client";

import React, { useState } from "react";
import { DataTable } from "./components/data-table";
import { columns, Modul } from "./components/columns";
import { useGetModul } from "@/services/api/modul";

interface ModulListingProps {
  search: string; // Terima search sebagai prop
  setSearch?: (value: string) => void; // Opsional: untuk memperbarui search
  data: any[]; // Data dari useGetModul di Page
  isPending: boolean; // Status loading
  currentPage: number; // Terima pageIndex dari Page
  totalPages: number; // Terima pageIndex dari Page
  totalItems: number; // Terima pageIndex dari Page
  onNextPage: () => void; // Terima fungsi untuk mengubah pageIndex
  itemsPerPage: number; // Terima pageSize dari Page
  onPrevPage: () => void;
}

export default function ModulListing({
  search,
  setSearch,
  data,
  isPending,
  currentPage,
  totalPages,
  totalItems,
  onNextPage,
  itemsPerPage,
  onPrevPage,
}: ModulListingProps) {
  return (
    <DataTable<Modul, unknown>
      data={data}
      columns={columns}
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      onNextPage={onNextPage}
      onPrevPage={onPrevPage}
    />
  );
}
