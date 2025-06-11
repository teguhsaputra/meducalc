"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetModul } from "@/services/api/modul";

interface SaerchModulProps {
  value: string;
  onChange: (value: string) => void;
  search: string;
}

export function SearchModul({ value, onChange, search }: SaerchModulProps) {
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState("");
  const [isSelected, setIsSelected] = React.useState(false);
  const { data } = useGetModul(1, 10, search, true);

  const namaModulOptions = Array.from(
    new Set(
      data
        ?.map((item: any) => item.nama_modul)
        .filter((nama: any): nama is string => typeof nama === "string") || []
    )
  )
    .filter((nama): nama is string => !!nama && nama !== "N/A")
    .map((nama) => ({
      value: nama.toLowerCase().replace(/\s/g, "-"),
      label: nama,
    }));

  const filteredOptions = namaModulOptions.filter((modul) =>
    modul.label.toLowerCase().includes(filter.toLowerCase())
  );

  const handleReset = () => {
    onChange(""); // Kosongkan searchInput
    setIsSelected(false); // Reset state pilihan
    setFilter(""); // Reset filter
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">Cari modul...</span>

          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Cari..."
            className="h-9"
            value={filter}
            onValueChange={setFilter}
          />
          <CommandList>
            <CommandEmpty>Tidak ada modul.</CommandEmpty>
            <CommandGroup>
              {(filteredOptions.length > 0
                ? filteredOptions
                : namaModulOptions
              ).map((modul) => (
                <CommandItem
                  key={modul.value}
                  value={modul.value}
                  onSelect={(currentValue) => {
                    const selectedModul = namaModulOptions.find(
                      (m) => m.value === currentValue
                    );
                    onChange(selectedModul ? selectedModul.label : ""); // Perbarui searchInput
                    setIsSelected(true); // Tandai bahwa ada pilihan
                    setOpen(false);
                    setFilter(""); // Reset filter agar semua muncul lagi
                  }}
                  className="cursor-pointer" // Hindari sorotan bawaan
                >
                  {modul.label}
                </CommandItem>
              ))}
            </CommandGroup>
            {isSelected && (
              <div className="p-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
