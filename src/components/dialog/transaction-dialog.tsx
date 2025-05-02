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
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import Field from "../fields/field";
import SelectCategory from "../select/select-category";
import { FullForm } from "../ui/form";

type Props = {
  trigger: ReactNode;
  type: "income" | "expense";
};

export function TransactionDialog({ trigger, type }: Props) {
  const form = useForm<createTransactionType>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      type,
      date: new Date(),
    },
  });

  const { setValue, handleSubmit } = form;

  const onSubmit = handleSubmit((data) => {
    console.log("data:", data);
  });

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          form.reset({
            type,
            date: new Date(),
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
            name="amount"
            label="Amount"
            description="Transaction amount"
            // type="number"
            defaultValue={0}
          />
          <Field
            control={form.control}
            name="category"
            label="Category"
            description="Transaction amount"
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
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </FullForm>
      </DialogContent>
    </Dialog>
  );
}
