"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";
import { formatDate } from "@/lib/utils";
import { fork } from "child_process";
import { id } from "zod/v4/locales";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Modul = {
  no: number;
  id: number;
  nama_modul: string;
  tahun_ajaran: string;
  penanggung_jawab: string;
  total_siswa: number;
  tanggal_buat: string;
  tanggal_update: string;
};

export const columns: ColumnDef<Modul>[] = [
  {
    accessorKey: "no",
    header: "No",
  },
  {
    accessorKey: "nama_modul",
    header: "Nama Modul",
  },
  {
    accessorKey: "tahun_ajaran",
    header: "Tahun Ajaran",
  },
  {
    accessorKey: "penanggung_jawab",
    header: "Penanggung Jawab",
  },
  {
    accessorKey: "total_siswa",
    header: "Total Siswa",
  },
  {
    accessorKey: "tanggal_buat",
    header: "Tanggal Buat",
    cell: ({ row }) => formatDate(row.original.tanggal_buat),
  },
  {
    accessorKey: "tanggal_update",
    header: "Tanggal Update",
    cell: ({ row }) => formatDate(row.original.tanggal_update),
  },
  {
    accessorKey: "id",
    header: "Aksi",
    cell: ({ row }) => <CellAction id={row.original.id} />,
  },
];
