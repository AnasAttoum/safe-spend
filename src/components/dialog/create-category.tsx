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
  const [open, setOpen] = useState(false);
  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(createCategorySchema),
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
      toast.success(`Category ${data.name} ${category ? "updated" : "created"} successfully 🎉`, {
        id: "create-category",
      });
      setOpen(false);
      if (setOpenCategoriesList) setOpenCategoriesList(false);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!",
        {
          id: "create-category",
        }
      );
    },
  });

  const onSubmit = handleSubmit((values: CreateCategorySchemaType) => {
    toast.loading(category ? "Updating category" : "Creating category", {
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
            Create new
          </Button>
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Update" : "Create"}{" "}
            <span
              className={type === "income" ? "text-income" : "text-expense"}
            >
              {type}
            </span>{" "}
            category
          </DialogTitle>
          {!category && <DialogDescription>
            create category to group your transactions
          </DialogDescription>}
        </DialogHeader>

        <FullForm form={form} onSubmit={onSubmit}>
          <Field control={form.control} name="name" label="Name" />
          <Field
            control={form.control}
            name="icon"
            label="Icon"
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
              Cancel
            </Button>
            <Button type="submit" className={cn("flex-1 cursor-pointer", `${type}Btn`)} disabled={isPending}>
              {isPending ? "Loading..." : category ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </FullForm>
      </DialogContent>
    </Dialog>
  );
}
