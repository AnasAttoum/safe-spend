"use client";

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
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { makeCategoryMulti, makeCategorySingle } from "@/actions/category";

type Props = {
  targetType?: "income" | "expense" | null;
  id: string;
  closeMenu?: () => void
};

export function MultiDialog({ targetType = null, id, closeMenu = () => { } }: Props) {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: async (formId: string) => {
      if (targetType) {
        return await makeCategorySingle(formId, targetType);
      }
      else {
        return await makeCategoryMulti(formId);
      }
    },
    onSuccess: () => {
      toast.success(
        `${t(`category.updated-successfully`)}`,
        { id }
      );
      queryClient.invalidateQueries({
        queryKey: ["category"],
      });
      closeMenu();
      router.refresh();
    },
    onError: () => {
      toast.error(t("something-went-wrong"), { id });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="multiBtn flex-1 py-5 my-0! uppercase">
          {targetType
            ? `${t("category.make-it-single")} (${targetType})`
            : t("category.make-it-multi")
          }
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("are-you-sure")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t(targetType ? "category.make-it-single-desc" : "category.make-it-multi-desc")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            className="multiBtn cursor-pointer"
            onClick={() => {
              toast.loading(t("category.updating"), { id });
              mutate(id);
            }}
          >
            {t("continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
