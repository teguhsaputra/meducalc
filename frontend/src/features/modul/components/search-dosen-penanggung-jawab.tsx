"use client";

import { Check, ChevronsUpDown, X } from "lucide-react";
import * as React from "react";
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
import { useGetDosenPenanggungJawab } from "@/services/api/modul";
import {Control, useController } from "react-hook-form";

interface SearchDosenPenanggungJawabProps {
  control: Control<any>;
  name: string;
}
const SearchDosenPenanggungJawab = ({
  control,
  name,
}: SearchDosenPenanggungJawabProps) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [selectedDosen, setSelectedDosen] = React.useState<{
    id: number;
    nama: string;
  } | null>(null);
  const { data, refetch } = useGetDosenPenanggungJawab(search);

  const { field } = useController({
    name,
    control,
  });

  React.useEffect(() => {
    const delayDebounce = setTimeout(() => {
      refetch();
    }, 300); // Debounce 300ms
    return () => clearTimeout(delayDebounce);
  }, [search, refetch]);

  const handleSelectDosen = (dosen: { id: number; nama: string }) => {
    field.onChange(dosen.nama);
    setOpen(false);
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
          <span className="truncate text-neutral-300">
            {field.value || "Cari ..."}
          </span>

          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Cari dosen..."
            className="h-9"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {data && (
              <CommandGroup>
                {data.map((dosen: { id: number; nama: string }) => (
                  <CommandItem
                    key={dosen.id}
                    value={dosen.nama}
                    onSelect={() => handleSelectDosen(dosen)}
                    className="cursor-pointer"
                  >
                    {dosen.nama}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchDosenPenanggungJawab;
