import { HomeNavItem, SidebarNavItem } from "@/types/nav";

export interface SidebarConfig {
  sidebarNav: SidebarNavItem[];
}

export const sidebarConfig: Record<string, SidebarConfig> = {
  admin: {
    sidebarNav: [
      {
        title: "",
        items: [
          {
            title: "Modul",
            href: "/admin/modul",
            items: [],
            disabled: false,
          },
        ],
      },
      {
        title: "",
        items: [
          {
            title: "Dosen",
            href: "/admin/dosen",
            items: [],
            disabled: false,
          },
        ],
      },
      {
        title: "",
        items: [
          {
            title: "Input Penilaian",
            href: "/admin/input-penilaian",
            items: [],
            disabled: false,
          },
        ],
      },
      {
        title: "",
        items: [
          {
            title: "Hasil Penilaian",
            href: "/admin/hasil-penilaian",
            items: [],
            disabled: false,
          },
        ],
      },
      {
        title: "",
        items: [
          {
            title: "Mahasiswa",
            href: "/admin/mahasiswa",
            items: [],
            disabled: false,
          },
        ],
      },
    ],
  },

  koordinator: {
    sidebarNav: [
      {
        title: "",
        items: [
          {
            title: "Modul",
            href: "/admin/modul",
            items: [],
            disabled: true,
          },
        ],
      },
      {
        title: "",
        items: [
          {
            title: "Dosen",
            href: "/admin/dosen",
            items: [],
            disabled: false,
          },
        ],
      },
      {
        title: "",
        items: [
          {
            title: "Input Penilaian",
            href: "/admin/input-penilaian",
            items: [],
            disabled: true,
          },
        ],
      },
      {
        title: "",
        items: [
          {
            title: "Hasil Penilaian",
            href: "/admin/hasil-penilaian",
            items: [],
            disabled: false,
          },
        ],
      },
      {
        title: "",
        items: [
          {
            title: "Mahasiswa",
            href: "/admin/mahasiswa",
            items: [],
            disabled: true,
          },
        ],
      },
    ],
  },

  dosen: {
    sidebarNav: [
      {
        title: "",
        items: [
          {
            title: "Modul",
            href: "/dosen/modul",
            items: [],
            disabled: false,
          },
        ],
      },
      {
        title: "",
        items: [
          {
            title: "Input Penilaian",
            href: "/dosen/input-penilaian",
            items: [],
            disabled: false,
          },
        ],
      },
      {
        title: "",
        items: [
          {
            title: "Hasil Penilaian",
            href: "/dosen/hasil-penilaian",
            items: [],
            disabled: false,
          },
        ],
      },
    ],
  },

  mahasiswa: {
    sidebarNav: [
      {
        title: "",
        items: [
          {
            title: "Modul",
            href: "/mahasiswa/modul",
            items: [],
            disabled: false,
          },
        ],
      },
      {
        title: "",
        items: [
          {
            title: "Hasil Penilaian",
            href: "/mahasiswa/penilaian",
            items: [],
            disabled: false,
          },
        ],
      },
    ],
  },
  set_user_dosen: {
    sidebarNav: [
      {
        title: "",
        items: [
          {
            title: "Modul",
            href: "/dosen/modul",
            items: [],
            disabled: false,
          },
        ],
      },
      {
        title: "",
        items: [
          {
            title: "Input Penilaian",
            href: "/dosen/input-penilaian",
            items: [],
            disabled: false,
          },
        ],
      },
      {
        title: "",
        items: [
          {
            title: "Hasil Penilaian",
            href: "/dosen/hasil-penilaian",
            items: [],
            disabled: false,
          },
        ],
      },
    ],
  },

  set_user_mahasiswa: {
    sidebarNav: [
      {
        title: "",
        items: [
          {
            title: "Modul",
            href: "/mahasiswa/modul",
            items: [],
            disabled: false,
          },
        ],
      },
      {
        title: "",
        items: [
          {
            title: "Hasil Penilaian",
            href: "/mahasiswa/penilaian",
            items: [],
            disabled: false,
          },
        ],
      },
    ],
  },
};
