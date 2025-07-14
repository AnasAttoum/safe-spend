"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Field from "../fields/field";
import { FullForm } from "../ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { dateToUTCDate } from "@/lib/date-helper";
import { createExchangeSchema, createExchangeType } from "@/schema/exchange";
import { createExchange, updateExchange } from "@/actions/exchange";
import { queryKey } from "@/config/query-key";
import { getExchangesHistoryDataResponseType } from "@/app/api/exchanges/route";

type Props = {
  trigger: ReactNode;
  currency?: string;
  exchange?: getExchangesHistoryDataResponseType[0];
  closeMenu?: () => void;
};

export function ExchangeDialog({ trigger, currency, exchange, closeMenu }: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<createExchangeType>({
    resolver: zodResolver(createExchangeSchema),
    defaultValues: {
      date: new Date(),
      exchangeCurrency: currency,
      targetCurrency: currency,
    },
  });

  const { handleSubmit, reset, watch } = form;

  useEffect(() => {
    if (exchange)
      reset({
        exchangeAmount: exchange.exchangeAmount,
        collectedAmount: exchange.collectedAmount,
        date: exchange.date,
        exchangeCurrency: exchange.exchangeCurrency,
        targetCurrency: exchange.targetCurrency,
        title: exchange.title,
      })
  }, [open, exchange, reset])


  const { mutate, isPending } = useMutation({
    mutationFn: async (form: createExchangeType) => {
      const res = exchange ? await updateExchange({ ...form, id: exchange.id }) : await createExchange(form);
      if (res && res.error) {
        throw new Error(res.error);
      }
    },
    onSuccess: () => {
      toast.success(exchange ? `Exchange updated successfully 🎉` : `Exchange created successfully 🎉`, {
        id: "create-exchange",
      });
      setOpen(false);
      reset({
        exchangeAmount: 0,
        collectedAmount: 0,
        date: new Date(),
        title: "",
        exchangeCurrency: currency,
        targetCurrency: currency,
      });

      // Invalidate the overview query which will refetch data in the home page
      queryClient.invalidateQueries({ queryKey: [queryKey.overview] });
      queryClient.invalidateQueries({ queryKey: [queryKey.exchange] });

      if (closeMenu) closeMenu()
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!",
        {
          id: "create-exchange",
        }
      );
    },
  });

  const onSubmit = handleSubmit((data: createExchangeType) => {
    toast.loading(exchange ? `Updating exchange...` : `Creating exchange...`, {
      id: "create-exchange",
    });
    mutate({ ...data, date: dateToUTCDate(data.date) });
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(openCurr) => {
        setOpen(openCurr);
        if (!openCurr) {
          form.reset({
            exchangeAmount: 0,
            collectedAmount: 0,
            date: new Date(),
            title: "",
            exchangeCurrency: currency,
            targetCurrency: currency,
          });
        }
      }}
    >
      <DialogTrigger asChild className="cursor-pointer">
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {exchange ? "Update" : "Create a new"}{" "}
            <span className={"text-safeSpend-primary"}>exchange</span>{" "}
          </DialogTitle>
          {/* <DialogDescription>
          Add your transactions
          </DialogDescription> */}
        </DialogHeader>
        <FullForm form={form} onSubmit={onSubmit}>
          <Field
            control={form.control}
            name="title"
            label="Title"
          />
          <Field
            control={form.control}
            name="exchangeCurrency"
            label="Exchange Currency"
            nodetype="currency"
          />
          <Field
            control={form.control}
            name="exchangeAmount"
            label={`Amount ( ${watch("exchangeCurrency")} )`}
            // type="number"
            defaultValue={0}
          />
          <Field
            control={form.control}
            name="targetCurrency"
            label="Target Currency"
            nodetype="currency"
          />
          <Field
            control={form.control}
            name="collectedAmount"
            label={`Amount ${watch("targetCurrency") ? `( ${watch("targetCurrency")} )` : ""
              }`}
            defaultValue={0}
          />
          <Field
            control={form.control}
            name="date"
            label="Date"
            nodetype="date"
          />

          <DialogFooter>
            <Button type="submit" className="cursor-pointer primaryBtn" disabled={isPending}>
              {isPending ? "Loading..." : exchange ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </FullForm>
      </DialogContent>
    </Dialog>
  );
}
