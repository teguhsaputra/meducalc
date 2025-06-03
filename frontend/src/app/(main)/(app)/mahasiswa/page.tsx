"use client";

import { useAuthStore } from "@/stores/use-auth-store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push("/mahasiswa/modul");
    } else {
      router.push("/");
    }
  }, [token, router]);

  return null;
};

export default Page;
