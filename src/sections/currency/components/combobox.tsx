"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Icon from "@/components/icon/icon";
import { currencies } from "@/config/currencies";
import { useMutation, useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/skeleton/skeleton";
import { User } from "@/generated/prisma";
import { updateUserCurrency } from "@/actions/user";
import { toast } from "sonner";

type Status = {
  value: string;
  label: string;
};

export function ComboBox() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedOption, setselectedOption] = React.useState<Status | null>(
    null
  );

  const { isFetching, data } = useQuery<User>({
    queryKey: ["user"],
    queryFn: () => fetch("/api/user").then((res) => res.json()),
  });

  React.useEffect(() => {
    if (!data) return;
    const userCurrency = currencies.find(
      (currency) => currency.value === data.currency
    );
    if (userCurrency) setselectedOption(userCurrency);
  },[data]);

  const mutation = useMutation({
    mutationFn: updateUserCurrency,
    onSuccess: (data) => {
      toast.success("Currency updated successfully 🎉", {
        id: "updateCurrency",
      });

      setselectedOption(
        currencies.find((currency) => currency.value === data.currency) || null
      );
    },

    onError: () => {
      toast.error("Something went wrong", {
        id: "updateCurrency",
      });
    },
  });

  const onSelectCurrency = React.useCallback((currency: Status | null) => {
    if (!currency) {
      toast.error("Please select a currency!");
      return;
    }
    toast.loading("Updating currency...", {
      id: "updateCurrency",
    });
    mutation.mutate(currency.value);
  },[mutation]);

  if (isDesktop) {
    return (
      <SkeletonWrapper isFetching={isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled={mutation.isPending}
            >
              {selectedOption ? (
                <>{selectedOption.label}</>
              ) : (
                <>
                  <Icon icon="plus" /> Add Currency
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <StatusList
              setOpen={setOpen}
              setselectedOption={onSelectCurrency}
            />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isFetching={isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled={mutation.isPending}
          >
            {selectedOption ? (
              <>{selectedOption.label}</>
            ) : (
              <>
                <Icon icon="plus" /> Add Currency
              </>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <StatusList
              setOpen={setOpen}
              setselectedOption={onSelectCurrency}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
}

function StatusList({
  setOpen,
  setselectedOption,
}: {
  setOpen: (open: boolean) => void;
  setselectedOption: (status: Status | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter status..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {currencies.map((currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setselectedOption(
                  currencies.find((currency) => currency.value === value) ||
                    null
                );
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
