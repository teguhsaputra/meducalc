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

interface SearchSchoolYearProps {
  value: string;
  onChange: (value: string) => void;
  search: string;
}

export function SearchSchoolYear({
  value,
  onChange,
  search,
}: SearchSchoolYearProps) {
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState("");
  const [isSelected, setIsSelected] = React.useState(false);

  const { data } = useGetModul(1, 10, search, true);

  const tahunAjaranOptions = Array.from(
    new Set(
      data
        ?.map((item: any) => item.tahun_ajaran)
        .filter((tahun: any): tahun is string => typeof tahun === "string") ||
        []
    )
  )
    .filter((tahun): tahun is string => !!tahun && tahun !== "N/A")
    .map((tahun) => ({
      value: tahun.toLowerCase().replace("-", "/"),
      label: tahun,
    }));

  const filteredOptions = tahunAjaranOptions.filter((year) =>
    year.label.toLowerCase().includes(filter.toLowerCase())
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
          {value
            ? tahunAjaranOptions.find((year) => year.value === value)?.label
            : "Pilih Tahun Ajaran..."}
          <ChevronsUpDown className="opacity-50" />
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
            <CommandEmpty>Tidak ada tahun ajaran.</CommandEmpty>
            <CommandGroup>
              {(filteredOptions.length > 0
                ? filteredOptions
                : tahunAjaranOptions
              ).map((year) => (
                <CommandItem
                  key={year.value}
                  value={year.value}
                  onSelect={(currentValue) => {
                    const selectedYear = tahunAjaranOptions.find(
                      (m) => m.value === currentValue
                    );
                    onChange(selectedYear ? selectedYear.label : "");
                    setIsSelected(true);
                    setOpen(false);
                    setFilter("");
                  }}
                  className="cursor-pointer"
                >
                  {year.label}
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
