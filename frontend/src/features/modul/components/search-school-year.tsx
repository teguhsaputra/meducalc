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
}

export function SearchSchoolYear({ value, onChange }: SearchSchoolYearProps) {
  const [open, setOpen] = React.useState(false);
  const { data } = useGetModul();

  const tahunAjaranOptions = Array.from(
    new Set(
      data
        ?.map((item: any) => item.tahun_ajaran)
        .filter((tahun: any): tahun is string => typeof tahun === "string") || []
    )
  )
    .filter((tahun): tahun is string => !!tahun && tahun !== "N/A")
    .map((tahun) => ({
      value: tahun.toLowerCase().replace("/", "-"),
      label: tahun,
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
            ? tahunAjaranOptions.find((year) => year.value === value)?.label
            : "2023-2024"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Cari..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {tahunAjaranOptions.map((year) => (
                <CommandItem
                  key={year.value}
                  value={year.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {year.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === year.value ? "opacity-100" : "opacity-0"
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
