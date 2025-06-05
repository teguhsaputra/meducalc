import { useAuthStore } from "@/stores/use-auth-store";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axiosInstace from "../axios";
import { toast } from "sonner";

export function useGetMahasiswa(
  pageIndex: number = 1,
  pageSize: number = 10,
  search = ""
) {
  const token = useAuthStore((state) => state.token);
  const validatedPageIndex = Math.max(0, pageIndex);
  const page = validatedPageIndex + 1;

  const { data, isPending } = useQuery({
    queryKey: ["get-mahasiswa", page, pageSize, search],
    queryFn: async () => {
      const res = await axiosInstace.get("/mahasiswa", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          limit: pageSize,
          search,
        },
      });

      return res.data.data;
    },
    placeholderData: keepPreviousData,
  });

  return {
    data: data?.data || [],
    pagination: data || {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: pageSize,
    },
    isPending,
  };
}

export function useGetAllMahasiswa(
  pageIndex: number = 0,
  pageSize: number = 10,
  searchSiswa = "",
  searchNim = "",
  searchAngkatan = "",
  triggerSearch = false
) {
  const token = useAuthStore((state) => state.token);
  const validatedPageIndex = Math.max(0, pageIndex);
  const page = validatedPageIndex + 1;

  const { data, isPending } = useQuery({
    queryKey: [
      "get-all-mahasiswa",
      page,
      pageSize,
      searchSiswa,
      searchNim,
      searchAngkatan,
      triggerSearch,
    ],
    queryFn: async () => {
      const res = await axiosInstace.get("/mahasiswa", {
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
    placeholderData: keepPreviousData,
    retry: 1,
  });

  return {
    data: data?.data?.data || [],
    currentPage: data?.data?.currentPage || 1,
    totalPages: data?.data?.totalPages || 1,
    totalItems: data?.data?.totalItems || 0,
    itemsPerPage: data?.data?.pageSize || pageSize,
    isPending,
  };
}

export function useGetDetailMahasiswaByNim(nim: string) {
  const token = useAuthStore((state) => state.token);

  const { data, isPending } = useQuery({
    queryKey: ["get-all-mahasiswa", nim],
    queryFn: async () => {
      const res = await axiosInstace.get(`/mahasiswa/${nim}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.data;
    },
    retry: 1,
  });

  return {
    data,
    isPending,
  };
}

export function useGetMahasiswaById(id: number) {
  const token = useAuthStore((state) => state.token);

  const { data } = useQuery({
    queryKey: ["get-detail-mahasiswa-by-id"],
    queryFn: async () => {
      const res = await axiosInstace.get(`/mahasiswa/detail/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.data;
    },
  });

  return { data };
}

export function useAddMahasiswa() {
  const token = useAuthStore((state) => state.token);

  const { mutate, isPending } = useMutation({
    mutationKey: ["add-mahasiswa"],
    mutationFn: async ({
      namaDepan,
      namaBelakang,
      tanggalLahir,
      jenisKelamin,
      nim,
      angkatan,
      username,
      password,
    }: {
      namaDepan: string;
      namaBelakang: string;
      tanggalLahir: string;
      jenisKelamin: string;
      nim: string;
      angkatan: number;
      username: string;
      password: string;
    }) => {
      const res = await axiosInstace.post(
        "/mahasiswa/add",
        {
          namaDepan,
          namaBelakang,
          tanggalLahir,
          jenisKelamin,
          nim,
          angkatan,
          username,
          password,
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
      toast.success("Mahasiswa berhasil dibuat");
    },
  });

  return {
    mutate,
    isPending,
  };
}

export function useEditMahasiswaById(id: number) {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["edit-mahasiswa", id],
    mutationFn: async ({
      namaDepan,
      namaBelakang,
      tanggalLahir,
      jenisKelamin,
      nim,
      angkatan,
      username,
    }: {
      namaDepan: string;
      namaBelakang: string;
      tanggalLahir: string;
      jenisKelamin: string;
      nim: string;
      angkatan: number;
      username: string;
    }) => {
      const res = await axiosInstace.put(
        `/mahasiswa/edit/${id}`,
        {
          namaDepan,
          namaBelakang,
          tanggalLahir,
          jenisKelamin,
          nim,
          angkatan,
          username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-mahasiswa"] });
      queryClient.invalidateQueries({
        queryKey: ["get-detail-mahasiswa-by-id"],
      });
      toast.success("Mahasiswa berhasil diedit");
    },
  });

  return {
    mutate,
    isPending,
  };
}

export function useGetModulMahasiswa(
  pageIndex: number = 0,
  pageSize: number = 10,
  searchModul = "",
  searchTahunAjaran = ""
) {
  const token = useAuthStore((state) => state.token);

  const validatedPageIndex = Math.max(0, pageIndex);
  const page = validatedPageIndex + 1;

  const { data, isPending } = useQuery({
    queryKey: [
      "get-modul-mahasiswa",
      page,
      pageSize,
      searchModul,
      searchTahunAjaran,
    ],
    queryFn: async () => {
      const res = await axiosInstace.get("/user/mahasiswa", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          limit: pageSize,
          searchModul,
          searchTahunAjaran,
        },
      });

      return res.data;
    },
  });

  return {
    data: data?.data?.data || [],
    currentPage: data?.page || 1,
    totalPages: data?.totalPages || 1,
    totalItems: data?.total || 0,
    itemsPerPage: pageSize,
    isPending,
  };
}

export function useGetHasilPenilaianByNimMahasiswa(namaModul: string, nim: string) {
  const token = useAuthStore((state) => state.token);

  const { data, isPending } = useQuery({
    queryKey: ["get-hasil-penilaian-by-nim"],
    queryFn: async () => {
      const res = await axiosInstace.get(`/user/mahasiswa/${namaModul}/${nim}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.data;
    },
  });

  return { data, isPending };
}
