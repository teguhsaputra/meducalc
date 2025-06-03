"use client";

import React, { useState } from "react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { useGetModul } from "@/services/api/modul";

export default function ModulListing() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const { data, pagination, isPending } = useGetModul(
    pageIndex,
    pageSize,
    search
  );

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
