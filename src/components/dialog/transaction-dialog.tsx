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
import { getTransactionsHistoryDataResponseType } from "@/app/[locale]/api/transactions/route";
import { useTranslations } from "next-intl";
import { DeleteDialog } from "./delete-dialog";
import { BookmarkIcon } from "lucide-react";

type Props = {
  trigger: ReactNode;
  type: "income" | "expense";
  currency?: string;
  transaction?: getTransactionsHistoryDataResponseType[0];
  closeMenu?: () => void;
  isBookmark?: boolean;
};

export function TransactionDialog({ trigger, type, currency, transaction, closeMenu, isBookmark }: Props) {
  const t = useTranslations();
  const tErrors = useTranslations("errors");
  const tTransaction = useTranslations("transaction");

  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const isEditing = transaction && !isBookmark;

  const form = useForm<createTransactionType>({
    resolver: zodResolver(createTransactionSchema(tErrors)),
    defaultValues: {
      type,
      date: new Date(),
      currency,
      bookmark: false,
    },
  });

  const { setValue, handleSubmit, reset, watch } = form;
  const selectedCategory = watch('category')

  useEffect(() => {
    if (transaction)
      reset({
        amount: transaction.amount,
        title: transaction.title,
        description: transaction.description,
        date: isBookmark ? new Date() : transaction.date,
        category: { ...transaction.Category, id: transaction.categoryId },
        type: transaction.type as "income" | "expense",
        currency: transaction.currency,
        bookmark: isBookmark ? false : transaction.bookmark,
      })
  }, [open, transaction, reset])

  const { mutate, isPending } = useMutation({
    mutationFn: async (form: createTransactionType | updateTransactionType) => {
      const res = isEditing ? await updateTransaction({ ...form, id: transaction.id }) : await createTransaction(form);
      if (res && res.error) {
        throw new Error(res.error);
      }
    },
    onSuccess: () => {
      toast.success(isEditing ? tTransaction("updated-successfully") : tTransaction("created-successfully"), {
        id: "create-transaction",
      });
      setOpen(false);
      reset({
        type,
        amount: 0,
        date: new Date(),
        category: undefined,
        title: "",
        description: "",
        currency,
        bookmark: false,
      });

      queryClient.invalidateQueries({ queryKey: [queryKey.overview] });
      queryClient.invalidateQueries({ queryKey: [queryKey.transaction] });

      if (closeMenu) closeMenu()
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : t("something-went-wrong"),
        {
          id: "create-transaction",
        }
      );
    },
  });

  const onSubmit = handleSubmit((data: createTransactionType) => {
    toast.loading(isEditing ? tTransaction("updating") : tTransaction("creating"), {
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
            description: "",
            currency,
            bookmark: false,
          });
        }
      }}
    >
      <DialogTrigger asChild className="cursor-pointer">
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("update") : tTransaction.rich("create-" + type, {
              span: (chunks) => (
                <span className={type === "income" ? "text-income" : "text-expense"}>
                  {chunks}
                </span>
              ),
            })}{" "}
          </DialogTitle>
          {/* <DialogDescription>
          Add your transactions
          </DialogDescription> */}
        </DialogHeader>
        <FullForm form={form} onSubmit={onSubmit}>
          <Field
            control={form.control}
            name="title"
            label="title"
          // description="Transaction title"
          />
          <Field
            control={form.control}
            name="currency"
            label="currency"
            // description="Transaction currency"
            nodetype="currency"
          />
          <Field
            control={form.control}
            name="amount"
            label={`${t("labels.amount")} ( ${watch("currency")} )`}
            // description="Transaction amount"
            type="number"
            defaultValue={0}
            withoutTranslation
          />
          <Field
            control={form.control}
            name="category"
            label="category"
            // description="Transaction category"
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
            label="date"
            // description="Select a date for this transaction"
            nodetype="date"
          />

          <Field
            control={form.control}
            name="description"
            label="description"
            nodetype="textarea"
          />

          {isBookmark ?
            <DeleteDialog
              item="bookmark"
              id={transaction?.id || ""}
              trigger={
                <Button className="deleteBtn w-full flex-1 mt-0! normal-case!">
                  <BookmarkIcon className="fill-white" />
                  {t("labels.remove-bookmark")}
                </Button>
              }
              closeMenu={() => {
                queryClient.invalidateQueries({ queryKey: [queryKey.transaction, queryKey.bookmark] });
                setOpen(false);
              }}
            />
            : <Field
              control={form.control}
              name="bookmark"
              label="bookmark-this"
              nodetype="bookmark"
            />}

          <DialogFooter>
            <Button
              type="submit"
              className={clsx("cursor-pointer", `${type}Btn`)}
              disabled={isPending}
            >
              {isPending ? t("loading") : isEditing ? t("update") : t("create")}
            </Button>
          </DialogFooter>
        </FullForm>
      </DialogContent>
    </Dialog>
  );
}
