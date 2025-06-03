import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string): string => {
  if (!dateString) {
    return "Invalid Date"; // Menangani jika dateString kosong atau undefined
  }

  const date = new Date(dateString);

  // Memastikan date adalah valid
  if (isNaN(date.getTime())) {
    return "Invalid Date"; // Jika tidak valid, kembalikan teks kesalahan
  }

  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);

  return formattedDate;
};
