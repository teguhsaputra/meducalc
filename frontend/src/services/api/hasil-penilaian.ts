import { useAuthStore } from "@/stores/use-auth-store";
import { useQuery } from "@tanstack/react-query";
import axiosInstace from "../axios";

export function useGetModulDetailHasilPenilaian(
  pageIndex: number = 1,
  pageSize: number = 10,
  namaModul: string,
  searchSiswa: string = "",
  searchNim: string = "",
  sortOrder: "asc" | "desc" = "asc",
  tingkatFilter: "A" | "B" | "C" | "D" | "E" | "" = ""
) {
  const token = useAuthStore((state) => state.token);
  const validatedPageIndex = Math.max(0, pageIndex);
  const page = validatedPageIndex + 1;

  const { data, isPending } = useQuery({
    queryKey: [
      "get-modul-detail-hasil-penilaian",
      page,
      pageSize,
      searchSiswa,
      searchNim,
      sortOrder,
      tingkatFilter,
    ],
    queryFn: async () => {
      const res = await axiosInstace.get(`/hasil/modul/${namaModul}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          limit: pageSize,
          searchSiswa,
          searchNim,
          sortOrder,
          tingkatFilter,
        },
      });

      return res.data;
    },
    staleTime: 5 * 60 * 1000,
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

export function useGetHasilInputPenilaian(nim: string) {
  const token = useAuthStore((state) => state.token);

  const { data, isPending } = useQuery({
    queryKey: ["get-hasil-input-penilaian"],
    queryFn: async () => {
      const res = await axiosInstace.get(`/hasil/modul/peserta/${nim}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.data;
    },
  });

  return { data, isPending };
}
