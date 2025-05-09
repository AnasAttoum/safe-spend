"use client";

import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { currencies } from "@/config/currencies";
import CurrencyRow from "./row/currency-row";

type Props = { selected: string; onSelect: (val: any) => void };

export default function SelectCurrency({ selected, onSelect }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="cursor-pointer flex justify-start">
          {!!selected ? (
            <CurrencyRow currency={selected} />
          ) : (
            <span className="text-gray-400 font-normal">Select currency</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Command>
          <CommandInput placeholder="Search Currency..." className="h-9" />
          <CommandList>
            <CommandGroup>
              {currencies.map((curr) => (
                <CommandItem
                  key={curr.value}
                  // value={curr.name}
                  onSelect={() => {
                    onSelect(curr.value);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <CurrencyRow currency={curr} />
                  <Check
                    className={cn(
                      "ml-auto",
                      selected === curr.value ? "opacity-100" : "opacity-0"
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
