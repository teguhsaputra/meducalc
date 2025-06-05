"use client";

import NimPesertaInputPenilaian from "@/features/dosen/user-dosen/components/nim-peserta-input-penilaian";
import React from "react";

type PageProps = { params: { slug: string; nim: string } };

const Page = ({ params }: PageProps) => {
  const namaModul = decodeURIComponent(params.slug);

  return <NimPesertaInputPenilaian namaModul={namaModul} nim={params.nim} />;
};

export default Page;
