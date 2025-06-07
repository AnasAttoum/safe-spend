"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Category } from "@/generated/prisma";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import CreateCategory from "../dialog/create-category";
import Loading from "../loading/loading";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import CategoryRow from "./row/category-row";
import { queryKey } from "@/config/query-key";

type Props = {
  type: "income" | "expense";
  setValueTransaction: (name: "categoryId", val: string) => void;
};

export default function SelectCategory({ type, setValueTransaction }: Props) {
  const [value, setValue] = useState<Category>();
  const [open, setOpen] = useState(false);

  const { isLoading, data } = useQuery<Category[]>({
    queryKey: [queryKey.category, type],
    queryFn: () =>
      fetch(`/api/category?type=${type}`).then((res) => res.json()),
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="cursor-pointer flex justify-start">
          {!!value ? (
            <CategoryRow category={value} />
          ) : (
            <span className="text-gray-400 font-normal">Select category</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Command>
          <CommandInput placeholder="Search category..." className="h-9" />
          <CreateCategory
            type={type}
            setValue={setValue}
            setValueTransaction={setValueTransaction}
            setOpen={setOpen}
          />
          {isLoading ? (
            <Loading />
          ) : (
            <CommandList>
              {data && (
                <>
                  {!data.length ? (
                    <CommandEmpty>No categories found.</CommandEmpty>
                  ) : (
                    <CommandGroup>
                      {data.map((category) => (
                        <CommandItem
                          key={category.name}
                          // value={category.name}
                          onSelect={() => {
                            setValue(category);
                            setValueTransaction("categoryId", category.id);
                            setOpen(false);
                          }}
                          className="cursor-pointer"
                        >
                          <CategoryRow category={category} />
                          <Check
                            className={cn(
                              "ml-auto",
                              value?.name === category.name
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </>
              )}
            </CommandList>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
