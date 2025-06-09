import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axiosInstace from "../axios";
import { useAuthStore } from "@/stores/use-auth-store";
import { useModulContext } from "@/hooks/use-modul-context";
import { useRouter } from "next/navigation";
import { TAddPenilaianData, TCreatePemicus, TPemicus } from "@/types/types";

interface BobotNilaiAkhir {
  sumatif: number;
  proses: number;
  praktikum: number;
}

interface BobotNilaiProses {
  diskusi: number;
  buku_catatan: number;
  temu_pakar: number;
  peta_konsep: number;
  proses_praktik: number;
}

interface CreateModulData {
  nama_modul: string;
  tahun_mulai: number;
  tahun_selesai: number;
  penanggung_jawab: string;
  bobot_nilai_akhir: BobotNilaiAkhir;
  bobot_nilai_proses: BobotNilaiProses;
  praktikum_id: number[];
}

export function useGetModul(
  pageIndex: number = 1,
  pageSize: number = 10,
  search = ""
) {
  const token = useAuthStore((state) => state.token);

  const validatedPageIndex = Math.max(0, pageIndex);
  const page = validatedPageIndex + 1;

  const { data, isPending } = useQuery({
    queryKey: ["get-all-modul", page, pageSize, search],
    queryFn: async () => {
      const res = await axiosInstace.get("/modul/admin", {
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

export function useCreateModul() {
  const setModulId = useModulContext((state) => state.setModulId);
  const setPraktikumId = useModulContext((state) => state.setPraktikumId);
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-modul"],
    mutationFn: async (data: CreateModulData) => {
      const res = await axiosInstace.post("/modul/admin/add", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.data;
    },
    onSuccess: (data) => {
      const modul_id = data.id;
      const praktikum_id = data.praktikum_id;
      setModulId(modul_id);
      setPraktikumId(praktikum_id);

      queryClient.invalidateQueries({ queryKey: ["get-all-modul"] });
      router.push("/admin/modul/tambah-modul/tambah-pemicu");
    },
  });

  return { mutate, isPending };
}

export function useAddPemicuModul() {
  const modul_id = useModulContext((state) => state.modul_id);
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["add-pemicu"],
    mutationFn: async ({ pemicus }: { pemicus: TPemicus[] }) => {
      const res = await axiosInstace.post(
        "/modul/admin/add-pemicu",
        {
          modul_id,
          pemicus,
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
      queryClient.invalidateQueries({ queryKey: ["get-all-modul"] });
      router.push("/admin/modul/tambah-modul/tambah-pemicu/penilaian-modul");
    },
  });

  return { mutate, isPending };
}

export function useAddPenilaianModul() {
  const modul_id = useModulContext((state) => state.modul_id);
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["add-penilaian-modul"],
    mutationFn: async (data: Omit<TAddPenilaianData, "modul_id">) => {
      const res = await axiosInstace.post(
        "/modul/admin/add-penilaian",
        {
          modul_id,
          ...data,
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
      queryClient.invalidateQueries({ queryKey: ["get-all-modul"] });
      router.push(
        "/admin/modul/tambah-modul/tambah-pemicu/penilaian-modul/peserta"
      );
    },
  });

  return { mutate, isPending };
}

export function useAddPesertaModul() {
  const token = useAuthStore((state) => state.token);
  const modul_id = useModulContext((state) => state.modul_id);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["add-peserta-modul"],
    mutationFn: async ({ mahasiswaId }: { mahasiswaId: number[] }) => {
      await axiosInstace.post(
        "/modul/admin/add-peserta",
        {
          modul_id,
          mahasiswaId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-modul"] });
      queryClient.invalidateQueries({ queryKey: ["get-peserta-by-modul"] });
      router.push(
        "/admin/modul/tambah-modul/tambah-pemicu/penilaian-modul/peserta/kelompok"
      );
    },
  });

  return { mutate, isPending };
}

export function useGetPesertaByModul() {
  const token = useAuthStore((state) => state.token);
  const modul_id = useModulContext((state) => state.modul_id);

  const { data } = useQuery({
    queryKey: ["get-peserta-by-modul", modul_id],
    queryFn: async () => {
      const res = await axiosInstace.get(`/peserta?modul_id=${modul_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.data;
    },
    enabled: !!modul_id,
  });

  return { data };
}

export function useGetKelompokByModul() {
  const token = useAuthStore((state) => state.token);
  const modul_id = useModulContext((state) => state.modul_id);

  const { data } = useQuery({
    queryKey: ["get-kelompok-by-modul", modul_id],
    queryFn: async () => {
      const res = await axiosInstace.get(`/kelompok?modul_id=${modul_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.data;
    },
    enabled: !!modul_id,
  });

  return { data };
}

export function useCreateKelompok() {
  const token = useAuthStore((state) => state.token);
  const modul_id = useModulContext((state) => state.modul_id);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["add-kelompok"],
    mutationFn: async () => {
      await axiosInstace.post(
        "/modul/admin/kelompok/add",
        {
          modul_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-modul"] });
      queryClient.invalidateQueries({ queryKey: ["get-kelompok-by-modul"] });
    },
  });

  return { mutate, isPending };
}
export function useDeleteKelompok() {
  const token = useAuthStore((state) => state.token);
  const modul_id = useModulContext((state) => state.modul_id);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-kelompok"],
    mutationFn: async ({kelompokId}: {kelompokId: number}) => {
      await axiosInstace.post(
        "/modul/admin/kelompok/delete",
        {
          modul_id,
          kelompokId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-modul"] });
      queryClient.invalidateQueries({ queryKey: ["get-kelompok-by-modul"] });
    },
  });

  return { mutate, isPending };
}

export function useAddPesertaToKelompok() {
  const token = useAuthStore((state) => state.token);
  const modul_id = useModulContext((state) => state.modul_id);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["add-peserta-to-kelompok"],
    mutationFn: async ({
      kelompokId,
      nims,
    }: {
      kelompokId: number;
      nims: string[];
    }) => {
      await axiosInstace.post(
        "/modul/admin/kelompok/add-peserta",
        {
          modul_id,
          kelompokId,
          nims,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-modul"] });
      queryClient.invalidateQueries({ queryKey: ["get-kelompok-by-modul"] });
      queryClient.invalidateQueries({
        queryKey: ["get-peserta-kelompok-anggota"],
      });
    },
  });

  return { mutate, isPending };
}
export function useDeletePesertaFromKelompok() {
  const token = useAuthStore((state) => state.token);
  const modul_id = useModulContext((state) => state.modul_id);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["add-peserta-to-kelompok"],
    mutationFn: async ({
      kelompokAnggotaId,
    }: {
      kelompokAnggotaId: number;
    }) => {
      await axiosInstace.post(
        "/modul/admin/kelompok/delete-peserta",
        {
          kelompokAnggotaId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-modul"] });
      queryClient.invalidateQueries({ queryKey: ["get-kelompok-by-modul"] });
      queryClient.invalidateQueries({
        queryKey: ["get-peserta-kelompok-anggota"],
      });
    },
  });

  return { mutate, isPending };
}

export function useGetPesertaKelompokAnggota() {
  const token = useAuthStore((state) => state.token);
  const modul_id = useModulContext((state) => state.modul_id);

  const { data } = useQuery({
    queryKey: ["get-peserta-kelompok-anggota", modul_id],
    queryFn: async () => {
      const res = await axiosInstace.get(
        `/peserta-kelompok?modul_id=${modul_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data.data;
    },
  });

  return { data };
}

export function useGetModulById(id: number) {
  const token = useAuthStore((state) => state.token);

  const { data } = useQuery({
    queryKey: ["get-modul-by-id", id],
    queryFn: async () => {
      const res = await axiosInstace.get(`/modul/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.data;
    },
  });

  return { data };
}
