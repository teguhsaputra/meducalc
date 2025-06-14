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
  TableMeta,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type TModulPenilaian = {
  id: string;
  nama_modul: string;
  tahun_ajaran: number;
  total_siswa: number;
};

interface ExtendedTableMeta<TData> extends TableMeta<TData> {
  sesiData?: { isActive: boolean; message?: string };
}

export const columns: ColumnDef<TModulPenilaian>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "nama_modul",
    header: "Nama Modul",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nama_modul")}</div>
    ),
  },
  {
    accessorKey: "tahun_ajaran",
    header: "Tahun Ajaran",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("tahun_ajaran")}</div>
    ),
  },
  {
    accessorKey: "total_siswa",
    header: "Total Siswa",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("total_siswa")}</div>
    ),
  },
  {
    accessorKey: "id",
    header: "Aksi",
    cell: ({ row, table }) => {
      const sesiData = (
        table.options.meta as ExtendedTableMeta<TModulPenilaian>
      )?.sesiData;
      const isDisabled = !sesiData?.isActive;

      return (
        <div className="flex justify-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Link
                  href={
                    isDisabled
                      ? "#"
                      : `/dosen/input-penilaian/${row.getValue("nama_modul")}`
                  }
                  onClick={(e) => isDisabled && e.preventDefault()}
                  aria-disabled={isDisabled}
                  className={
                    isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                  }
                >
                  <Eye
                    className="w-5 h-5"
                    style={{ stroke: isDisabled ? "#A0A0A0" : "#72A1E7" }}
                  />
                </Link>
              </TooltipTrigger>
              {isDisabled && (
                <TooltipContent>
                  <p>Sesi penilaian tidak aktif</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];

export function DosenModulInputPenilaianListing({
  data,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  isLoading,
  onNextPage,
  onPrevPage,
  sesiData,
}: {
  data: TModulPenilaian[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  isLoading: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  sesiData: { isActive: boolean; message?: string };
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
    meta: { sesiData } as ExtendedTableMeta<TModulPenilaian>,
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
      <div className="flex items-center justify-end space-x-2 mt-5">
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
