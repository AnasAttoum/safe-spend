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
import SelectCurrency from "../select/select-currency";
import EmojiPicker from "../emoji-picker";
import { Textarea } from "../ui/textarea";
import { useTranslations } from "next-intl";

type Props = {
  control: any;
  name: string;
  label: string;
  description?: string;
  type?: string;
  defaultValue?: string | number;
  specificNode?: ReactNode;
  nodetype?: "date" | "icon" | "currency" | "textarea";
  withoutTranslation?: boolean;
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
  withoutTranslation = false,
}: Props) {
  const t = useTranslations("labels");

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{withoutTranslation ? label : t(label)}</FormLabel>
          <FormControl>
            {specificNode && isValidElement(specificNode) ? (
              specificNode
            ) : nodetype ? (
              nodetype === "date" ? (
                <DatePicker selected={field.value} onSelect={field.onChange} />
              ) : nodetype === "icon" ? (
                <EmojiPicker fieldValue={field.value} onChange={field.onChange} />
              ) : nodetype === 'currency' ? (
                <SelectCurrency selected={field.value} onSelect={field.onChange} />
              ) : nodetype === "textarea" ? (
                <Textarea
                  className="resize-none"
                  rows={3}
                  {...field}
                />
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
