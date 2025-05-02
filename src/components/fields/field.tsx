import React, { isValidElement, ReactNode } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { DatePicker } from "./date-picker";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";

type Props = {
  control: any;
  name: string;
  label: string;
  description?: string;
  type?: string;
  defaultValue?: string | number;
  specificNode?: ReactNode;
  nodetype?: "date" | "icon";
};

export default function Field({
  control,
  name,
  label,
  description = "",
  type = "text",
  defaultValue = "",
  specificNode,
  nodetype,
}: Props) {
  const theme = useTheme();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {specificNode && isValidElement(specificNode) ? (
              specificNode
            ) : nodetype ? (
              nodetype === "date" ? (
                <DatePicker selected={field.value} onSelect={field.onChange} />
              ) : nodetype === "icon" ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-28">
                      {field.value ? (
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
                        theme={theme.resolvedTheme}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                "NOTFOUND"
              )
            ) : (
              <Input defaultValue={defaultValue} {...field} type={type} />
            )}
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
