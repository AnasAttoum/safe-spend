"use client";

import { removeBookmark } from "@/actions/bookmark";
import { deleteCategory } from "@/actions/category";
import { deleteExchange } from "@/actions/exchange";
import { deleteTransaction } from "@/actions/transaction";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { routes } from "@/config/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { toast } from "sonner";
import { useCountDown } from "../count-down";

type Props = {
  item: "category" | "transaction" | "exchange" | "bookmark";
  trigger: ReactNode;
  id: string;
  closeMenu?: () => void
};

export function DeleteDialog({ item, trigger, id, closeMenu = () => { } }: Props) {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const countDown = useCountDown(7, open)

  const { mutate } = useMutation({
    mutationFn: async (formId: string) => {
      if (item === "category") {
        return await deleteCategory(formId);
      } else if (item === "transaction") {
        return await deleteTransaction(formId);
      }
      else if (item === "exchange") {
        return await deleteExchange(formId);
      }
      else if (item === "bookmark") {
        return await removeBookmark(formId);
      }
    },
    onSuccess: () => {
      toast.success(
        `${t(`delete-dialog.${item}`)} ${item === "bookmark" ? t("removed-successfully") : t("deleted-successfully")}`,
        { id }
      );
      queryClient.invalidateQueries({
        queryKey: [item],
      });
      closeMenu();

      if (item === "category")
        router.push(routes.categories)
    },
    onError: () => {
      toast.error(t("something-went-wrong"), { id });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("are-you-sure")}</AlertDialogTitle>
          {item !== "bookmark" && <AlertDialogDescription>
            {`${t("this-cannot-be-undone2")} ${t(`delete-dialog.${item}`)}.`}
          </AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            className="deleteSimpleBtn"
            onClick={() => {
              toast.loading(`${item === "bookmark" ? t("removing") : t("deleting")} ${t(`delete-dialog.${item}`)}...`, { id });
              mutate(id);
            }}
            disabled={countDown > 0}
          >
            {`${t("delete")} ${countDown > 0 ? `(${countDown})` : ""}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
