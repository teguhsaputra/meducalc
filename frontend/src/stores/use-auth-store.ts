import { TProfile } from "@/types/types";
import { persist } from "zustand/middleware";
import { create } from "zustand";

interface LoginStore {
  user: TProfile | null | undefined;
  token: string;
  login: (user: TProfile | null | undefined, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<LoginStore>()(
  persist(
    (set) => ({
      user: undefined,
      token: "",
      login: (user, token) => {
        set({ user, token });
        localStorage.setItem("token", token);
      },
      logout: () => {
        set({ user: undefined, token: "" });
        localStorage.removeItem("token");
      },
    }),
    {
      name: "auth",
      partialize: (state) => ({ token: state.token }),
    }
  )
);
