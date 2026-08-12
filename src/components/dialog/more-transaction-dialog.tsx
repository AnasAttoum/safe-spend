"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  moreTransactionSchema,
  moreTransactionType,
} from "@/schema/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Field from "../fields/field";
import { FullForm } from "../ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moreTransaction } from "@/actions/transaction";
import { toast } from "sonner";
import { queryKey } from "@/config/query-key";
import { getTransactionsHistoryDataResponseType } from "@/app/[locale]/api/transactions/route";
import { useTranslations } from "next-intl";
import Icon from "../icon/icon";

type Props = {
  transaction: getTransactionsHistoryDataResponseType[0];
  closeMenu: () => void;
};

export function MoreTransactionDialog({ transaction, closeMenu }: Props) {
  const t = useTranslations();
  const tErrors = useTranslations("errors");
  const tTransaction = useTranslations("transaction");

  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<moreTransactionType>({
    resolver: zodResolver(moreTransactionSchema(tErrors)),
    defaultValues: {
      amount: 0,
    },
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (transaction)
      reset({
        amount: 0,
      })
  }, [open, transaction, reset])

  const { mutate, isPending } = useMutation({
    mutationFn: async (form: moreTransactionType) => {
      const res = await moreTransaction(form, transaction.id);
      if (res && res.error) {
        throw new Error(res.error);
      }
    },
    onSuccess: () => {
      toast.success(tTransaction("updated-successfully"), {
        id: "more-transaction",
      });
      setOpen(false);
      reset({
        amount: 0,
      });

      queryClient.invalidateQueries({ queryKey: [queryKey.overview] });
      queryClient.invalidateQueries({ queryKey: [queryKey.transaction] });

      if (closeMenu) closeMenu()
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : t("something-went-wrong"),
        {
          id: "more-transaction",
        }
      );
    },
  });

  const onSubmit = handleSubmit((data: moreTransactionType) => {
    toast.loading(tTransaction("updating"), {
      id: "more-transaction",
    });
    mutate(data);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(openCurr) => {
        setOpen(openCurr);
        if (!openCurr) {
          form.reset({
            amount: 0,
          });
        }
      }}
    >
      <DialogTrigger asChild className="cursor-pointer">
        <Button variant="ghost" className="w-full text-start grid grid-cols-[auto_1fr]">
          <div className="flex justify-center">
            <Icon icon="card" />
          </div>
            {tTransaction("increase")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {tTransaction("increase")}
          </DialogTitle>
          <DialogDescription>
            {tTransaction("increase-info")}
          </DialogDescription>
        </DialogHeader>
        <FullForm form={form} onSubmit={onSubmit}>
          <Field
            control={form.control}
            name="amount"
            label={`${t("labels.amount")} ( ${transaction.currency} )`}
            // description="Transaction amount"
            type="number"
            defaultValue={0}
            withoutTranslation
          />

          <DialogFooter>
            <Button
              type="submit"
              className="primaryBtn cursor-pointer"
              disabled={isPending}
            >
              {isPending ? t("loading") : t("update")}
            </Button>
          </DialogFooter>
        </FullForm>
      </DialogContent>
    </Dialog>
  );
}
