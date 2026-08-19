import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { countries, countryFlag, findCountry, type Country } from "@/lib/countries";

export function CountryCodeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (iso2: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected: Country | undefined = findCountry(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 shrink-0"
        >
          <span className="text-base leading-none">{selected ? countryFlag(selected.iso2) : "🌐"}</span>
          <span className="text-slate-300">{selected ? `+${selected.dialCode}` : "Code"}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0 bg-[#151519] border-white/10" align="start">
        <Command
          filter={(itemValue, search) => (itemValue.includes(search.toLowerCase()) ? 1 : 0)}
        >
          <CommandInput placeholder="Search country or code..." className="text-white" />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.iso2}
                  value={`${country.name} ${country.iso2} ${country.dialCode}`.toLowerCase()}
                  onSelect={() => {
                    onChange(country.iso2);
                    setOpen(false);
                  }}
                  className="text-white data-[selected=true]:bg-white/10"
                >
                  <span className="text-base leading-none mr-1">{countryFlag(country.iso2)}</span>
                  <span className="flex-1 truncate">{country.name}</span>
                  <span className="text-slate-400">+{country.dialCode}</span>
                  <Check
                    className={cn(
                      "ml-1 w-4 h-4",
                      selected?.iso2 === country.iso2 ? "opacity-100" : "opacity-0",
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
