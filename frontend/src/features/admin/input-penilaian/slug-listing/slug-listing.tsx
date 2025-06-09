"use client";
import React, { useState } from "react";
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pen, Trash } from "lucide-react";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useGetMe } from "@/services/api/auth";
import { toast } from "sonner";
import { CellAction } from "./column";

export type TPesertaDetailModul = {
  id: string;
  nama_siswa: string;
  nim: string;
  angkatan: number;
  username: string;
};

export const columns: ColumnDef<TPesertaDetailModul>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "nama_siswa",
    header: "Nama Siswa",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nama_siswa")}</div>
    ),
  },
  {
    accessorKey: "nim",
    header: "NIM",
    cell: ({ row }) => <div className="lowercase">{row.getValue("nim")}</div>,
  },
  {
    accessorKey: "angkatan",
    header: "Angkatan",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("angkatan")}</div>
    ),
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("username")}</div>
    ),
  },
  {
    accessorKey: "id",
    header: "Aksi",
    cell: ({ row, table }) => {
      const slug = (table.options.meta as { slug?: string })?.slug || "";
      const nim = row.getValue("nim") as string;

      return <CellAction slug={slug} nim={nim} />;
    },
  },
];

export function SlugListing({
  data,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  isLoading,
  onNextPage,
  onPrevPage,
  slug,
}: {
  data: TPesertaDetailModul[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  isLoading: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  slug?: string;
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    meta: { slug },
  });

  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="relative flex flex-col space-y-4">
      <div className="rounded-lg border overflow-hidden">
        <ScrollArea className="w-full overflow-auto">
          <div className="min-w-[700px]">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="flex flex-col md:flex-row items-center md:justify-between text-sm text-muted-foreground space-y-4">
        <div>{table.getFilteredRowModel().rows.length} row(s) selected.</div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNextPage}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
