"use client"

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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useState } from "react";
import { useCountDown } from "../count-down";
import { resetUserData } from "../../actions/reset-user-data";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { queryKey } from "@/config/query-key";
import { useTranslations } from "next-intl";

export function DeleteMyDataDialog() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const countDown = useCountDown(9, open)
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: async () => {
      return await resetUserData();
    },
    onSuccess: () => {
      toast.success(
        t("your-data-deleted"),
        { id: 'delete-my-data' }
      );

      router.push(routes.currency);
      queryClient.invalidateQueries({
        queryKey: [queryKey.category, queryKey.history, queryKey.overview, queryKey.periods, queryKey.statistics, queryKey.transaction, queryKey.user],
      });
    },
    onError: (error) => {
      console.error("Error:", error)
      toast.error(t("something-went-wrong"), { id: 'delete-my-data' });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <div className="flex justify-end">
        <AlertDialogTrigger asChild>
          <Button className="deleteBtn">
            {t("delete-my-data")}
          </Button>
        </AlertDialogTrigger>
      </div>
      <AlertDialogContent onEscapeKeyDown={() => setOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-900">{t("are-you-sure")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("this-cannot-be-undone")}
            <br />
            <strong>{t("warning")}:</strong> {t("include-all-your-data")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="cursor-pointer uppercase text-red-900 hover:text-red-700"
            onClick={() => {
              toast.loading(t("deleting-your-data"), { id: 'delete-my-data' });
              mutate();
            }}
            disabled={countDown > 0}
          >
            {countDown > 0 ? `${t("reset-all-data")} (${countDown})` : t("reset-all-data")}
          </AlertDialogCancel>
          <AlertDialogAction className="cursor-pointer">
            {t("cancel")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
