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

export type TMahasiswa = {
  id: string;
  nama_siswa: string;
  nim: string;
  angkatan: string;
  username: string;
};

export const columns: ColumnDef<TMahasiswa>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row, table }) => {
      const currentPage = (table.options.state.pagination?.pageIndex ?? 0) + 1;
      const itemsPerPage = table.options.state.pagination?.pageSize ?? 10;
      const globalIndex = (currentPage - 1) * itemsPerPage + row.index + 1;
      return globalIndex;
    },
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
    cell: ({ row }) => (
      <div className="flex justify-center gap-4">
        <Link href={`/admin/mahasiswa/${row.getValue("nim")}`}>
          <Eye className="w-5 h-5" style={{ stroke: "#72A1E7" }} />
        </Link>
        <Link href={`/admin/mahasiswa/edit-mahasiswa/${row.getValue("id")}`}>
          <Pen className="w-5 h-5" style={{ stroke: "#999999" }} />
        </Link>
        <Link href={`#`}>
          <Trash className="w-5 h-5 " style={{ stroke: "#FF6969" }} />
        </Link>
      </div>
    ),
  },
];

export function AdminMahasiswaListing({
  data,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  isLoading,
  onNextPage,
  onPrevPage,
}: {
  data: TMahasiswa[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  isLoading: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
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
    state: {
      pagination: {
        pageIndex: currentPage - 1, 
        pageSize: itemsPerPage,
      },
    },
    initialState: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: itemsPerPage,
      },
    },
  });

  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="w-full">
      <div className="rounded-md border">
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
        <div className='flex items-center justify-center text-sm font-medium'>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
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
