"use client";

import {
  createCategorySchema,
  CreateCategorySchemaType,
} from "@/schema/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "@/actions/category";
import { Category } from "@/generated/prisma";
import { toast } from "sonner";

type Props = {
  type: "income" | "expense";
  setValue: (val: Category) => void;
  setOpen: (val: false) => void;
};

export default function CreateCategory({
  type,
  setValue,
  setOpen: setOpenCategoriesList,
}: Props) {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { type },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: createCategory,

    onSuccess: async(data: Category) => {
      setValue(data);
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
      console.log("🚀 ~ error:", error, typeof error, Object.entries(error));
      toast.error(error instanceof Error ? error.message : "Something went wrong!", {
        id: "create-category",
      });
    },
  });

  const onSubmit = handleSubmit((values: CreateCategorySchemaType, e) => {
    e?.preventDefault();
    toast.loading("Creating category", {
      id: "create-category",
    });
    mutate(values);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create new</Button>
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

        <Form {...form}>
          <form className="space-y-4" onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  {/* <FormDescription>Category name</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="h-28">
                          {form.watch("icon") ? (
                            <span role="img" className="text-6xl">
                              {field.value}
                            </span>
                          ) : (
                            <div>Click to select</div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="bg-transparent border-0">
                        <div className="fixed inset-0 flex justify-center bottom-10">
                          <Picker
                            data={data}
                            onEmojiSelect={(emoji: { native: string }) =>
                              field.onChange(emoji.native)
                            }
                            perLine={9}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  {/* <FormDescription>
                    This is how category will appear in the app
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
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
                {isSubmitting ? "Loading..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
