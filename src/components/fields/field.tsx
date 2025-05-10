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

import { useTheme } from "next-themes";
import SelectCurrency from "../select/select-currency";
import EmojiPicker from "../emoji-picker";

type Props = {
  control: any;
  name: string;
  label: string;
  description?: string;
  type?: string;
  defaultValue?: string | number;
  specificNode?: ReactNode;
  nodetype?: "date" | "icon"| "currency";
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
                <EmojiPicker fieldValue={field.value} onChange={field.onChange} />
              ) : nodetype==='currency'?(
                <SelectCurrency selected={field.value} onSelect={field.onChange} />
              ): (
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
