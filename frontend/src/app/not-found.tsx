"use client";

import { Metadata } from "next";
import { useRouter } from "next/navigation";
import React from "react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "404 - Halaman Tidak Ditemukan | Meducalc",
    description:
      "Maaf, halaman yang Anda cari tidak ditemukan di Meducalc. Periksa URL atau kembali ke halaman sebelumnya.",
    openGraph: {
      title: "404 - Halaman Tidak Ditemukan | Meducalc",
      description:
        "Maaf, halaman yang Anda cari tidak ditemukan di Meducalc. Periksa URL atau kembali ke halaman sebelumnya.",
      url: "/404",
      siteName: "Meducalc",
      type: "website",
    },
    robots: {
      index: false, // Hindari pengindeksan halaman 404 oleh mesin pencari
      follow: false,
    },
  };
}

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="max-w-md w-full text-center">
        <h2 className="text-4xl font-bold tracking-tighter">Meducalc</h2>
      </div>

      <div className="max-w-md w-full mt-7 gap-5">
        <div>
          <span className="text-2xl font-medium">404 Not Found Error</span>
        </div>
        <div className="mt-5">
          <span className="text-base">
            Kami tidak dapat menemukan halaman yang Anda cari. Hal ini mungkin
            disebabkan oleh:
          </span>
        </div>

        <div className="mt-5">
          <ul className="list-disc list-inside">
            <li>
              Terjadi kesalahan pada URL yang dimasukkan ke peramban web Anda.
              Harap periksa URL dan coba lagi.
            </li>
            <li>Anda tidak memiliki izin untuk mengakses halaman ini.</li>
            <li>Halaman yang Anda cari telah dipindahkan atau dihapus.</li>
          </ul>

          <div className="text-center mt-5">
            <span>
              Anda dapat{" "}
              <span
                className="font-semibold cursor-pointer"
                onClick={() => router.back()}
              >
                kembali.
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
