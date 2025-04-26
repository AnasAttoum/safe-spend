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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

type Props = {
  type: "income" | "expense";
};

export default function CreateCategory({ type }: Props) {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { type },
  });
  return (
    <Dialog>
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
          <form>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>Category name</FormDescription>
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
                      <PopoverContent>
                        <Picker
                          data={data}
                          onEmojiSelect={(emoji: any) =>
                            field.onChange(emoji.native)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    This is how category will appear in the app
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
