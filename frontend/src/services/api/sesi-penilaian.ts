import { useAuthStore } from "@/stores/use-auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstace from "../axios";

export function useGetSesiPenilaian() {
  const token = useAuthStore((state) => state.token);

  const { data } = useQuery({
    queryKey: ["get-sesi-penilaian"],
    queryFn: async () => {
      const res = await axiosInstace.get("/admin/get-sesi-penilaian", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  return { data };
}

export function useSesiPenilaian() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["sesi-penilaian"],
    mutationFn: async ({
      action,
      sesiMulai,
      sesiSelesai,
    }: {
      action: string;
      sesiMulai: string;
      sesiSelesai: string;
    }) => {
      const res = await axiosInstace.post(
        "/admin/sesi-penilaian",
        { action, sesiMulai, sesiSelesai },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-sesi-penilaian"] });
    },
  });

  return { mutate, isPending };
}
