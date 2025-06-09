// CellAction.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Pen, Trash } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useGetMe } from "@/services/api/auth";
import { useToast } from "@/hooks/use-toast";

interface Props {
  slug: string;
  nim: string;
}

export const CellAction = ({ slug, nim }: Props) => {
  const { data } = useGetMe();
  const toastShownRef = useRef(false);
  const { toast } = useToast();

  const isAdmin = data?.role === "admin";

  useEffect(() => {
    if (isAdmin) {
      toast({
        title: "Mohon Maaf",
        description: "Admin tidak dapat akses untuk menginput penilaian",
        variant: "success",
      });
      toastShownRef.current = true;
    }
  }, [isAdmin, toast]);

  return (
    <div className="flex justify-center gap-4">
      {!isAdmin && (
        <Link
          href={`/admin/input-penilaian/${encodeURIComponent(slug)}/${nim}`}
        >
          <Pen className="w-5 h-5" style={{ stroke: "#999999" }} />
        </Link>
      )}
      <Link href="#">
        <Trash className="w-5 h-5" style={{ stroke: "#FF6969" }} />
      </Link>
    </div>
  );
};
