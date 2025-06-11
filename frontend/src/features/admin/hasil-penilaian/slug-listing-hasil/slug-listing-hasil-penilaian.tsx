"use client";
import React from "react";
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
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";

export type TModulHasilPenilaian = {
  id: string;
  nama_siswa: string;
  nim: string;
  nilai_akhir_sumatif: number;
  nilai_akhir_praktikum: number;
  tingkat_akhir: string;
  created_at: string;
};

export const columns: ColumnDef<TModulHasilPenilaian>[] = [
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
    accessorKey: "nilai_akhir_sumatif",
    header: "Nilai Akhir Sumatif",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("nilai_akhir_sumatif")}</div>
    ),
  },
  {
    accessorKey: "nilai_akhir_praktikum",
    header: "Nilai Akhir Praktikum ",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("nilai_akhir_praktikum")}</div>
    ),
  },
  {
    accessorKey: "tingkat_akhir",
    header: "Nilai Akhir Modul",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("tingkat_akhir")}</div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Waktu Buat",
    cell: ({ row }) => (
      <div className="lowercase">{formatDate(row.getValue("created_at"))}</div>
    ),
  },
  {
    accessorKey: "id",
    header: "Aksi",
    cell: ({ row, table }) => {
      const slug = (table.options.meta as { slug?: string })?.slug || "";

      return (
        <div className="flex justify-center gap-4">
          <Link
            href={`/admin/hasil-penilaian/${encodeURIComponent(
              slug
            )}/${row.getValue("nim")}`}
          >
            <Eye className="w-5 h-5 " style={{ stroke: "#72A1E7" }} />
          </Link>
        </div>
      );
    },
  },
];

export function SlugListingHasilPenilaian({
  data,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  isLoading,
  onNextPage,
  onPrevPage,
  onSortOrderChange,
  onTingkatFilterChange,
  onSearch,
  searchSiswa,
  searchNim,
  sortOrder,
  tingkatFilter,
  slug,
}: {
  data: TModulHasilPenilaian[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  isLoading: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  onSortOrderChange: (sortOrder: "asc" | "desc") => void;
  onTingkatFilterChange: (tingkat: "A" | "B" | "C" | "D" | "E" | "") => void;
  onSearch: (searchSiswa: string, searchNim: string) => void;
  searchSiswa: string;
  searchNim: string;
  sortOrder: "asc" | "desc";
  tingkatFilter: "A" | "B" | "C" | "D" | "E" | "";
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

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row py-4 gap-4">
        <div className="flex-1 flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <Label>Nama Siswa</Label>
            <Input
              value={searchSiswa}
              onChange={(e) => onSearch(e.target.value, searchNim)}
            />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <Label>NIM</Label>
            <Input
              value={searchNim}
              onChange={(e) => onSearch(searchSiswa, e.target.value)}
            />
          </div>
          <Button
            className="mt-5"
            onClick={() => onSearch(searchSiswa, searchNim)}
          >
            Cari Data
          </Button>
        </div>
        <div className="flex-1 flex flex-col md:flex-row gap-4 md:mt-5 mt-0">
          <Select
            value={sortOrder}
            onValueChange={(value) =>
              onSortOrderChange(value as "asc" | "desc")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Opsi" />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectGroup>
                <SelectItem value="asc">Terendah ke Tertinggi</SelectItem>
                <SelectItem value="desc">Tertinggi ke Terendah</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={tingkatFilter === "" ? "all" : tingkatFilter}
            onValueChange={(value) => {
              onTingkatFilterChange(
                value === "all" ? "" : (value as "A" | "B" | "C" | "D" | "E")
              );
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Nilai Akhir Modul" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="D">D</SelectItem>
                <SelectItem value="E">E</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border mt-5">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
      <div className="flex flex-col md:flex-row items-center md:justify-end space-y-4 space-x-2 mt-5">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
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
