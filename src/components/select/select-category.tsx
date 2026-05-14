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
import { SimpleCategory } from "@/lib/types";
import { useTranslations } from "next-intl";

type Props = {
  type: "income" | "expense";
  setValueTransaction: (name: "category", val: SimpleCategory) => void;
  selectedCategory: SimpleCategory | undefined;
};

export default function SelectCategory({ type, setValueTransaction, selectedCategory }: Props) {
  const t = useTranslations("category");
  const [open, setOpen] = useState(false);

  const { isLoading, data } = useQuery<Category[]>({
    queryKey: [queryKey.category, type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="cursor-pointer flex justify-start">
          {!!selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            <span className="text-gray-400 font-normal">{t("select")}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 h-80">
        <Command>
          <CommandInput placeholder={t("search")} className="h-9" />
          <CreateCategory
            type={type}
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
                    <CommandEmpty>{t("no-category")}</CommandEmpty>
                  ) : (
                    <CommandGroup>
                      {data.map((category) => (
                        <CommandItem
                          key={category.name}
                          // value={category.name}
                          onSelect={() => {
                            setValueTransaction("category", category);
                            setOpen(false);
                          }}
                          className="cursor-pointer"
                        >
                          <CategoryRow category={category} />
                          <Check
                            className={cn(
                              "ml-auto",
                              selectedCategory?.name === category.name
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
