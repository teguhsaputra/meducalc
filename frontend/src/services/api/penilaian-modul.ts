import { useAuthStore } from "@/stores/use-auth-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstace from "../axios";
import { TPenilaianInput } from "@/types/types";
import { toast } from "sonner";

export function useGetModulForPenilaianModul(
  pageIndex: number = 1,
  pageSize: number = 10,
  searchModul: string = "",
  searchSchoolYear: string = ""
) {
  const token = useAuthStore((state) => state.token);
  const validatedPageIndex = Math.max(0, pageIndex);
  const page = validatedPageIndex + 1;

  const { data, isPending } = useQuery({
    queryKey: [
      "get-modul-for-penilaian-modul",
      page,
      pageSize,
      searchModul,
      searchSchoolYear,
    ],
    queryFn: async () => {
      const res = await axiosInstace.get("/penilaian/modul", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          limit: pageSize,
          searchModul,
          searchSchoolYear,
        },
      });

      return res.data;
    },
  });

  return {
    data: data?.data?.data || [],
    currentPage: data?.currentPage || 1,
    totalPages: data?.totalPages || 1,
    totalItems: data?.totalItems || 0,
    itemsPerPage: pageSize,
    isPending,
  };
}

export function useGetModulDetailForPesertaPenilaianModul(
  pageIndex: number = 1,
  pageSize: number = 10,
  namaModul: string,
  searchSiswa: string = "",
  searchNim: string = "",
  searchAngkatan: string = ""
) {
  const token = useAuthStore((state) => state.token);
  const validatedPageIndex = Math.max(0, pageIndex);
  const page = validatedPageIndex + 1;

  const { data, isPending } = useQuery({
    queryKey: [
      "get-modul-detail-for-peserta-penilaian-modul",
      page,
      pageSize,
      searchSiswa,
      searchNim,
      searchAngkatan,
    ],
    queryFn: async () => {
      const res = await axiosInstace.get(`/penilaian/modul/${namaModul}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          limit: pageSize,
          searchSiswa,
          searchNim,
          searchAngkatan,
        },
      });

      return res.data;
    },
  });

  return {
    data: data?.data?.data || [],
    currentPage: data?.currentPage || 1,
    totalPages: data?.totalPages || 1,
    totalItems: data?.totalItems || 0,
    itemsPerPage: pageSize,
    isPending,
  };
}

export function useGetModulByNim(namaModul: string, nim: string) {
  const token = useAuthStore((state) => state.token);

  const { data } = useQuery({
    queryKey: ["get-modul-by-nim", namaModul, nim],
    queryFn: async () => {
      const res = await axiosInstace.get(
        `/penilaian/modul/peserta/${encodeURIComponent(namaModul)}/${nim}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data.data;
    },
    enabled: !!namaModul && !!nim && !!token,
  });

  return {
    data,
  };
}

export function useInputPenilaian(namaModul: string, nim: string) {
  const token = useAuthStore((state) => state.token);

  const { mutate, isPending } = useMutation({
    mutationKey: ["input-penilaian", namaModul, nim],
    mutationFn: async (input: TPenilaianInput) => {
      const res = await axiosInstace.post(
        `/penilaian/modul/peserta/${namaModul}/${nim}`,
        {
          input,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Input penilaian berhasil disimpan");
    },
  });

  return {
    mutate,
    isPending,
  };
}
