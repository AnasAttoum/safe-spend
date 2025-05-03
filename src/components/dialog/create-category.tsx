"use client";

import { createCategory } from "@/actions/category";
import { Category } from "@/generated/prisma";
import {
  createCategorySchema,
  CreateCategorySchemaType,
} from "@/schema/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
import {
  FullForm,
} from "../ui/form";
import Field from "../fields/field";

type Props = {
  type: "income" | "expense";
  setValue: (val: Category) => void;
  setOpen: (val: false) => void;
  setValueTransaction: (name: "category", val: string) => void;
};

export default function CreateCategory({
  type,
  setValue,
  setOpen: setOpenCategoriesList,
  setValueTransaction,
}: Props) {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { type },
  });

  const { reset, handleSubmit } = form;

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (form: CreateCategorySchemaType) => {
      const res = await createCategory(form);
      if (res.error) {
        throw new Error(res.error);
      }
      return res.data!;
    },

    onSuccess: async (data: Category) => {
      setValue(data);
      setValueTransaction("category", data.name);
      queryClient.invalidateQueries({ queryKey: ["category", type] });
      reset({
        name: "",
        icon: "",
      });
      toast.success(`Category ${data.name} created successfully 🎉`, {
        id: "create-category",
      });
      setOpen(false);
      setOpenCategoriesList(false);
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
    toast.loading("Creating category", {
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
        <Button variant="outline" className="cursor-pointer">
          Create new
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Create{" "}
            <span
              className={type === "income" ? "text-income" : "text-expense"}
            >
              {type}
            </span>{" "}
            category
          </DialogTitle>
          <DialogDescription>
            create category to group your transactions
          </DialogDescription>
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
            <Button type="submit" className="flex-1 cursor-pointer">
              {isPending ? "Loading..." : "Create"}
            </Button>
          </DialogFooter>
        </FullForm>
      </DialogContent>
    </Dialog>
  );
}
