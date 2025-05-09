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
} from "@/schema/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import Field from "../fields/field";
import SelectCategory from "../select/select-category";
import { FullForm } from "../ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction } from "@/actions/transaction";
import { toast } from "sonner";
import clsx from "clsx";

type Props = {
  trigger: ReactNode;
  type: "income" | "expense";
  currency: string;
};

export function TransactionDialog({ trigger, type, currency }: Props) {
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

  const { mutate, isPending } = useMutation({
    mutationFn: async (form: createTransactionType) => {
      const res = await createTransaction(form);
      if (res && res.error) {
        throw new Error(res.error);
      }
    },
    onSuccess: () => {
      toast.success(`Transaction created successfully 🎉`, {
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

      // Invalidate the overview query which will refetch data in the home page
      queryClient.invalidateQueries({ queryKey: ["overview"] });
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
    toast.loading(`Creating transaction...`, {
      id: "create-transaction",
    });
    mutate(data);
    // mutate({ ...data, date: dateToUTCDate(data.date) });
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
            Create a new{" "}
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
            // type="number"
            defaultValue={0}
          />
          <Field
            control={form.control}
            name="category"
            label="Category"
            description="Transaction category"
            specificNode={
              <SelectCategory type={type} setValueTransaction={setValue} />
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
            >
              {isPending ? "Loading..." : "Create"}
            </Button>
          </DialogFooter>
        </FullForm>
      </DialogContent>
    </Dialog>
  );
}
