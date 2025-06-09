import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstace from "../axios";
import { useAuthStore } from "@/stores/use-auth-store";
import { toast } from "sonner";
import { TPenilaianInput } from "@/types/types";

export function useGetIlmuAndDosen() {
  const { data } = useQuery({
    queryKey: ["get-ilmu-dosen"],
    queryFn: async () => {
      const res = await axiosInstace.get("/ilmu-dosen");

      return res.data.data;
    },
  });

  return { data };
}
export function useGetDosenModul(
  pageIndex: number = 1,
  pageSize: number = 10,
  search = ""
) {
  const token = useAuthStore((state) => state.token);
  const validatedPageIndex = Math.max(0, pageIndex);
  const page = validatedPageIndex + 1;

  const { data, isPending } = useQuery({
    queryKey: ["get-dosen-modul", page, pageSize, search],
    queryFn: async () => {
      const res = await axiosInstace.get("/dosen-modul", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          pageSize,
          search,
        },
      });

      return res.data;
    },
  });

  return {
    data: data?.data || [],
    currentPage: data?.currentPage || 1,
    totalPages: data?.totalPages || 1,
    totalItems: data?.totalItems || 0,
    itemsPerPage: pageSize,
    isPending,
  };
}

export function useGetModulByDosen(
  penanggungJawab: string,
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
      "get-modul-by-dosen",
      penanggungJawab,
      page,
      pageSize,
      searchModul,
      searchSchoolYear,
    ],
    queryFn: async () => {
      const res = await axiosInstace.get("/modul-by-dosen", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          penanggungJawab,
          page,
          limit: pageSize,
          searchModul,
          searchSchoolYear,
        },
      });

      console.log("response getModulbydosen", res.data);

      return res.data;
    },
    enabled: !!penanggungJawab,
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

export function useAddDosen() {
  const token = useAuthStore((state) => state.token);

  const { mutate, isError, isPending } = useMutation({
    mutationKey: ["add-dosen"],
    mutationFn: async ({
      namaDepan,
      tanggalLahir,
      username,
      password,
      role,
    }: {
      namaDepan: string;
      tanggalLahir: string;
      username: string;
      password: string;
      role: string;
    }) => {
      const res = await axiosInstace.post(
        "/admin/add-dosen",
        {
          namaDepan,
          tanggalLahir,
          username,
          password,
          role,
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
      toast.success("Dosen berhasil dibuat");
    },
    onError: () => {
      toast.error(isError);
    },
  });

  return { mutate, isPending };
}

// DOSEN "not dosen for admin"

export function useGetModulDosen(
  pageIndex: number = 0,
  pageSize: number = 10,
  searchModul = "",
  searchSchoolYear = ""
) {
  const token = useAuthStore((state) => state.token);
  const validatedPageIndex = Math.max(0, pageIndex);
  const page = validatedPageIndex + 1;

  const { data, isPending } = useQuery({
    queryKey: [
      "get-modul-dosen",
      page,
      pageSize,
      searchModul,
      searchSchoolYear,
    ],
    queryFn: async () => {
      const res = await axiosInstace.get("/dosen/modul", {
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

export function useGetModulDosenHasilPenilaian(
  pageIndex: number = 1,
  pageSize: number = 10,
  namaModul: string,
  searchSiswa: string = "",
  searchNim: string = "",
  sortOrder: "asc" | "desc" = "asc"
) {
  const token = useAuthStore((state) => state.token);
  const validatedPageIndex = Math.max(0, pageIndex);
  const page = validatedPageIndex + 1;

  const { data, isPending } = useQuery({
    queryKey: [
      "get-modul-dosen-hasil-penilaian",
      page,
      pageSize,
      namaModul,
      searchSiswa,
      searchNim,
      sortOrder,
    ],
    queryFn: async () => {
      const res = await axiosInstace.get(`/dosen/hasil/modul/${namaModul}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          limit: pageSize,
          searchSiswa,
          searchNim,
          sortOrder,
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

export function useGetModulDosenHasilInputPenilaian(
  namaModul: string,
  nim: string
) {
  const token = useAuthStore((state) => state.token);

  const { data, isPending } = useQuery({
    queryKey: ["get-modul-hasil-input-penilaian", namaModul, nim],
    queryFn: async () => {
      const res = await axiosInstace.get(
        `/dosen/hasil/modul/peserta/${namaModul}/${nim}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data.data;
    },
  });

  return { data, isPending };
}

export function useGetModulDosenDetailForPesertaPenilaianModul(
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
      const res = await axiosInstace.get(
        `/dosen/penilaian/modul/${namaModul}`,
        {
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
        }
      );

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

export function useGetModulDosenByNimPeserta(namaModul: string, nim: string) {
  const token = useAuthStore((state) => state.token);

  const { data } = useQuery({
    queryKey: ["get-modul-dosen-by-nim-peserta", namaModul, nim],
    queryFn: async () => {
      const res = await axiosInstace.get(
        `/dosen/penilaian/modul/peserta/${encodeURIComponent(
          namaModul
        )}/${nim}`,

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

export function useModulDosenInputPenilaian(namaModul: string, nim: string) {
  const token = useAuthStore((state) => state.token);

  const { mutate, isPending } = useMutation({
    mutationKey: ["input-penilaian", namaModul, nim],
    mutationFn: async (input: TPenilaianInput) => {
      const res = await axiosInstace.post(
        `/dosen/penilaian/modul/peserta/${namaModul}/${nim}`,
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
