import { currencies } from "@/config/currencies";
import { _Translator } from "next-intl";
import { z } from "zod";

export const createTransactionSchema = (t: _Translator<Record<string, any>, "errors">) =>
  z.object({
    amount: z.coerce
      .number({
        invalid_type_error: t("amount-must-be-number"),
        required_error: t("required"),
      })
      .positive(t("greater-than-0"))
      .max(1000000000, { message: t("max-amount") })
      .multipleOf(0.01, { message: t("amount-multiple") }),
    title: z
      .string()
      .min(1, { message: t("required") })
      .max(500, { message: t("max-500") }),
    description: z.string().max(500, { message: t("max-500") }).optional(),
    date: z.coerce.date(),
    category: z.object({
      id: z.string().min(1, { message: t("required") }),
      name: z
        .string()
        .min(1, { message: t("required") })
        .max(100, { message: t("max-100") }),
      icon: z.string().max(20, { message: t("max-20") }),
    }, { 
      required_error: t("required") 
    }),
    type: z.union([z.literal("income"), z.literal("expense")]),
    currency: z.custom((value) => {
      const found = currencies.some((currency) => currency.value === value);

      if (!found) return { error: t("invalid-currency") };

      return value;
    }),
    bookmark: z.boolean().optional(),
  });
export type createTransactionType = z.infer<
  ReturnType<typeof createTransactionSchema>
>;

export const updateTransactionSchema = (t: _Translator<Record<string, any>, "errors">) =>
  createTransactionSchema(t).extend({
    id: z
      .string()
      .min(1, { message: t("required") })
      .max(100, { message: t("max-100") }),
  });

export type updateTransactionType = z.infer<
  ReturnType<typeof updateTransactionSchema>
>;
