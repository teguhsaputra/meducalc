"use client";

import { useAuthStore } from "@/stores/use-auth-store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.replace("/dosen/modul");
    } else {
      router.replace("/");
    }
  }, [token, router]);

  return null;
};

export default Page;
