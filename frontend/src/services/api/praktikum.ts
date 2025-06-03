import { useQuery } from "@tanstack/react-query";
import axiosInstace from "../axios";
import { useModulContext } from "@/hooks/use-modul-context";
import { useAuthStore } from "@/stores/use-auth-store";

export function useGetPraktikum() {
  const { data } = useQuery({
    queryKey: ["get-praktikum"],
    queryFn: async () => {
      const res = await axiosInstace.get("/praktikums");

      return res.data.data;
    },
  });

  return { data };
}

export function useGetPraktikumByModul() {
  const modul_id = useModulContext((state) => state.modul_id);
  const token = useAuthStore((state) => state.token);

  const { data } = useQuery({
    queryKey: ["get-praktikum", modul_id],
    queryFn: async () => {
      const res = await axiosInstace.get(`/praktikum?modul_id=${modul_id}`, {
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

export function useGetJenisPenilaian() {
  const { data } = useQuery({
    queryKey: ["get-jenis-penilaian"],
    queryFn: async () => {
      const res = await axiosInstace.get("/jenis-penilaian");

      return res.data.data;
    },
  });

  return { data };
}
