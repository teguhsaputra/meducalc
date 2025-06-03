import { persist } from "zustand/middleware";
import { create } from "zustand";

interface ModulStore {
  modul_id: number;
  praktikum_id: number;
  setModulId: (modul_id: number) => void;
  setPraktikumId: (praktikum_id: number) => void;
}

export const useModulContext = create<ModulStore>()(
  persist(
    (set) => ({
      modul_id: 0,
      praktikum_id: 0,
      setModulId: (modul_id: number) => set({ modul_id }),
      setPraktikumId: (praktikum_id: number) => set({ praktikum_id }),
    }),
    {
      name: "modul",
      partialize: (state) => ({
        modul_id: state.modul_id,
        praktikum_id: state.praktikum_id,
      }),
    }
  )
);
