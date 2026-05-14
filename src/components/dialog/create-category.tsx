"use client";

import { createCategory, updateCategory } from "@/actions/category";
import { Category } from "@/generated/prisma";
import {
  createCategorySchema,
  CreateCategorySchemaType,
} from "@/schema/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { FullForm } from "../ui/form";
import Field from "../fields/field";
import { queryKey } from "@/config/query-key";
import { SimpleCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type Props = {
  type: "income" | "expense";
  setOpen?: (val: false) => void;
  setValueTransaction?: (
    name: "category",
    val: SimpleCategory
  ) => void;
  trigger?: ReactNode;
  category?: SimpleCategory;
};

export default function CreateCategory({
  type,
  setOpen: setOpenCategoriesList,
  setValueTransaction,
  trigger,
  category
}: Props) {
  const t = useTranslations();
  const tErrors = useTranslations("errors");
  const tCategory = useTranslations("category");
  const [open, setOpen] = useState(false);
  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(createCategorySchema(tErrors)),
    defaultValues: { type },
  });

  const { reset, handleSubmit } = form;

  const queryClient = useQueryClient();

  useEffect(() => {
    if (category)
      reset(category)
  }, [open, category, reset])

  const { mutate, isPending } = useMutation({
    mutationFn: async (form: CreateCategorySchemaType) => {
      const res = category ? await updateCategory({ ...form, id: category.id }) : await createCategory(form);
      if (res.error) {
        throw new Error(res.error);
      }
      return res.data!;
    },

    onSuccess: async (data: Category) => {
      if (setValueTransaction) {
        setValueTransaction("category", data);
      }
      queryClient.invalidateQueries({ queryKey: [queryKey.category, type] });
      reset({
        name: "",
        icon: "",
      });
      toast.success(category ? tCategory("updated-successfully") : tCategory("created-successfully"), {
        id: "create-category",
      });
      setOpen(false);
      if (setOpenCategoriesList) setOpenCategoriesList(false);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : t("something-went-wrong"),
        {
          id: "create-category",
        }
      );
    },
  });

  const onSubmit = handleSubmit((values: CreateCategorySchemaType) => {
    toast.loading(category ? tCategory("updating") : tCategory("creating"), {
      id: "create-category",
    });
    mutate(values);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          form.reset({ type });
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger
          ? trigger
          : <Button variant="outline" className="cursor-pointer">
            {t("create-new")}
          </Button>
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {category ? t("update") : t("create-new")}{" "}
            <span
              className={type === "income" ? "text-income" : "text-expense"}
            >
              {t(`transaction.${type}`)}
            </span>{" "}
            {tCategory("category")}
          </DialogTitle>
          {!category && <DialogDescription>
            {tCategory("create-to-group")}
          </DialogDescription>}
        </DialogHeader>

        <FullForm form={form} onSubmit={onSubmit}>
          <Field control={form.control} name="name" label="name" />
          <Field
            control={form.control}
            name="icon"
            label="icon"
            nodetype="icon"
          />

          <DialogFooter className="flex w-full">
            <Button
              type="button"
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" className={cn("flex-1 cursor-pointer", `${type}Btn`)} disabled={isPending}>
              {isPending ? t("loading") : category ? t("update") : t("create")}
            </Button>
          </DialogFooter>
        </FullForm>
      </DialogContent>
    </Dialog>
  );
}
