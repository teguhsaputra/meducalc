import { useAuthStore } from "@/stores/use-auth-store";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstace from "../axios";
import { useState } from "react";
import { TProfile } from "@/types/types";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

export function useLogin() {
  const [loginForm, setLoginForm] = useState<{
    username: string;
    password: string;
  }>({ username: "", password: "" });

  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      const res = await axiosInstace.post("/auth/login", {
        username,
        password,
      });

      return res.data.data;
    },
    onSuccess: (data) => {
      const user: TProfile = {
        role: data.role,
        username: data.username,
      };

      login(user, data.accessToken);

      if (data.role === "admin") {
        router.push("/admin");
      } else if (data.role === "dosen" || data.role === "set_user_dosen") {
        router.push("/dosen");
      } else if (data.role === "koordinator") {
        router.push("/admin/dosen");
      } else if (
        data.role === "mahasiswa" ||
        data.role === "set_user_mahasiswa"
      ) {
        router.push("/mahasiswa");
      } else {
        router.push("/");
      }
    },
    onError: (error: AxiosError<{message: string, status: boolean}>) => {
      const errorMessage = error.response?.data.message
      toast({
        title: "Ups..",
        description: errorMessage,
        variant: 'destructive' 
      })
    },
  });

  return { setLoginForm, mutate, isPending };
}

export function useGetMe() {
  const token = useAuthStore((state) => state.token);

  const { data } = useQuery({
    queryKey: ["get-me"],
    queryFn: async () => {
      const res = await axiosInstace.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.data;
    },
  });

  return { data };
}
