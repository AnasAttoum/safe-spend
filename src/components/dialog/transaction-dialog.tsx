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
import {
  createTransactionSchema,
  createTransactionType,
  updateTransactionType,
} from "@/schema/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Field from "../fields/field";
import SelectCategory from "../select/select-category";
import { FullForm } from "../ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import { toast } from "sonner";
import clsx from "clsx";
import { dateToUTCDate } from "@/lib/date-helper";
import { queryKey } from "@/config/query-key";
import { getTransactionsHistoryDataResponseType } from "@/app/api/transactions/route";

type Props = {
  trigger: ReactNode;
  type: "income" | "expense";
  currency?: string;
  transaction?: getTransactionsHistoryDataResponseType[0];
  closeMenu?: () => void;
};

export function TransactionDialog({ trigger, type, currency, transaction, closeMenu }: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<createTransactionType>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      type,
      date: new Date(),
      currency,
    },
  });

  const { setValue, handleSubmit, reset, watch } = form;
  const selectedCategory = watch('category')

  useEffect(() => {
    if (transaction)
      reset({
        amount: transaction.amount,
        title: transaction.title,
        date: transaction.date,
        category: { ...transaction.Category, id: transaction.categoryId },
        type: transaction.type as "income" | "expense",
        currency: transaction.currency
      })
  }, [open, transaction, reset])

  const { mutate, isPending } = useMutation({
    mutationFn: async (form: createTransactionType | updateTransactionType) => {
      const res = transaction ? await updateTransaction({ ...form, id: transaction.id }) : await createTransaction(form);
      if (res && res.error) {
        throw new Error(res.error);
      }
    },
    onSuccess: () => {
      toast.success(transaction ? `Transaction updated successfully 🎉` : `Transaction created successfully 🎉`, {
        id: "create-transaction",
      });
      setOpen(false);
      reset({
        type,
        amount: 0,
        date: new Date(),
        category: undefined,
        title: "",
        currency,
      });

      queryClient.invalidateQueries({ queryKey: [queryKey.overview] });
      queryClient.invalidateQueries({ queryKey: [queryKey.transaction] });

      if (closeMenu) closeMenu()
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!",
        {
          id: "create-transaction",
        }
      );
    },
  });

  const onSubmit = handleSubmit((data: createTransactionType) => {
    toast.loading(transaction ? `Updating transaction...` : `Creating transaction...`, {
      id: "create-transaction",
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
            type,
            amount: 0,
            date: new Date(),
            category: undefined,
            title: "",
            currency,
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
            {transaction ? "Update" : "Create a new"}{" "}
            <span
              className={type === "income" ? "text-income" : "text-expense"}
            >
              {type}
            </span>{" "}
            transaction
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
            description="Transaction title"
          />
          <Field
            control={form.control}
            name="currency"
            label="Currency"
            description="Transaction currency"
            nodetype="currency"
          />
          <Field
            control={form.control}
            name="amount"
            label={`Amount ( ${watch("currency")} )`}
            description="Transaction amount"
            type="number"
            defaultValue={0}
          />
          <Field
            control={form.control}
            name="category"
            label="Category"
            description="Transaction category"
            specificNode={
              <SelectCategory
                type={type}
                setValueTransaction={setValue}
                selectedCategory={selectedCategory}
              />
            }
          />
          <Field
            control={form.control}
            name="date"
            label="Date"
            description="Select a date for this transaction"
            nodetype="date"
          />

          <DialogFooter>
            <Button
              type="submit"
              className={clsx("cursor-pointer", `${type}Btn`)}
              disabled={isPending}
            >
              {isPending ? "Loading..." : transaction ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </FullForm>
      </DialogContent>
    </Dialog>
  );
}
