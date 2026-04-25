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
import { currencies, Currency, defaultCurrency } from "@/config/currencies";
import CurrencyRow from "./row/currency-row";

type Props = { selected: string[]; onSelect: (val: any) => void; myCurrencies: Currency["value"][] };

export default function SelectSpecificCurrencies({ selected, onSelect, myCurrencies }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="cursor-pointer flex justify-start">
          {selected.length ? (
            <div className="flex items-center gap-2 h-full whitespace-normal">
              {selected.map((el) =>
                currencies.find((curr) => curr.value === el)?.label || defaultCurrency.label
              ).join(", ")}
            </div>
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
              {myCurrencies.map((el) => {
                const curr = currencies.find(({ value }) => value === el) ?? defaultCurrency;
                return (
                  <CommandItem
                    key={curr.value}
                    // value={curr.name}
                    onSelect={() => {
                      const found = selected.find((el) => el === curr.value)
                      if (found) {
                        if (selected.length > 1)
                          onSelect(selected.filter((el) => el !== curr.value));
                      } else
                        onSelect([...selected, curr.value]);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <CurrencyRow currency={curr} />
                    <Check
                      className={cn(
                        "ml-auto",
                        selected.includes(curr.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
