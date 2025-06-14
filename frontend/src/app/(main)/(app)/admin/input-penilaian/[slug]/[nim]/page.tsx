"use client";

import NimInputPenilaian from "@/features/admin/input-penilaian/slug-listing/nim-input-penilaian/page";
import { withAuth } from "@/hooks/with-auth";
import React from "react";

type PageProps = { params: { slug: string; nim: string } };

const Page = ({ params }: PageProps) => {
  const namaModul = decodeURIComponent(params.slug);

  return <NimInputPenilaian namaModul={namaModul} nim={params.nim} />;
};

export default withAuth(Page);
