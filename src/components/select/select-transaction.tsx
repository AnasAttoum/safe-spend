"use client";

import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTransactionsHistoryDataResponseType } from "@/app/api/transactions/route";
import { queryKey } from "@/config/query-key";
import TransactionRow from "./row/transaction-row";
import { Transaction } from "@/generated/prisma";
import { UseFormReset } from "react-hook-form";
import SkeletonWrapper from "../skeleton/skeleton";

type Props = {
  selected: null | Transaction;
  onSelect: (val: any) => void;
  reset: UseFormReset<{
    amount: number;
    title: string;
    type: "income" | "expense";
    date: Date;
    category: {
      name: string;
      id: string;
      icon: string;
    };
    currency?: any;
  }>;
  type: "income" | "expense";
};

export default function SelectTransaction({ selected, onSelect, reset, type }: Props) {
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery<getTransactionsHistoryDataResponseType>({
    queryKey: [queryKey.transaction, queryKey.history, type],
    queryFn: () =>
      fetch(
        `/api/transactions?type=${type}`
      ).then((res) => res.json()),
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {(isLoading || !!data?.length) && <SkeletonWrapper isLoading={isLoading}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="cursor-pointer w-full primaryBtn">
            {!!selected ? (
              <TransactionRow transaction={selected} />
            ) : (
              <span className="font-normal">Reusing old transaction</span>
            )}
          </Button>
        </PopoverTrigger>
      </SkeletonWrapper>}
      <PopoverContent className="p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {data?.map((el) => (
                <CommandItem
                  key={el.id}
                  onSelect={() => {
                    onSelect(el);
                    reset({
                      amount: el.amount,
                      title: el.title,
                      date: new Date(),
                      category: { ...el.Category, id: el.categoryId },
                      type: el.type as "income" | "expense",
                      currency: el.currency
                    })
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <TransactionRow transaction={el} />
                  <Check
                    className={cn(
                      "ml-auto",
                      selected?.id === el.id ? "opacity-100" : "opacity-0"
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
