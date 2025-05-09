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

type Props = {
  type: "income" | "expense";
  setValueTransaction: (name: "category" | "categoryIcon", val: string) => void;
};

export default function SelectCategory({ type, setValueTransaction }: Props) {
  const [value, setValue] = useState<Category>();
  const [open, setOpen] = useState(false);

  const { isFetching, data } = useQuery<Category[]>({
    queryKey: ["category", type],
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
          {isFetching ? (
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
                            setValueTransaction("category", category.name);
                            setValueTransaction("categoryIcon", category.icon);
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
