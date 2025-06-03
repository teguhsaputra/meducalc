"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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
}

export function SearchModul({ value, onChange }: SaerchModulProps) {
  const [open, setOpen] = React.useState(false);
  const { data } = useGetModul();

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? namaModulOptions.find((modul) => modul.value === value)?.label
            : "Cari modul..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Cari..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {namaModulOptions.map((modul) => (
                <CommandItem
                  key={modul.value}
                  value={modul.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {modul.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === modul.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
