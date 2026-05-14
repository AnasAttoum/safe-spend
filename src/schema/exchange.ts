import { currencies } from "@/config/currencies";
import { _Translator } from "next-intl";
import { z } from "zod";

export const baseExchangeSchema = (
  t: _Translator<Record<string, any>, "errors">,
) =>
  z.object({
    exchangeAmount: z.coerce
      .number({
        invalid_type_error: t("amount-must-be-number"),
        required_error: t("required"),
      })
      .positive(t("greater-than-0"))
      .max(1000000000, { message: t("max-amount") })
      .multipleOf(0.01, { message: t("amount-multiple") }),
    collectedAmount: z.coerce
      .number({
        invalid_type_error: t("amount-must-be-number"),
        required_error: t("required"),
      })
      .positive(t("greater-than-0"))
      .max(1000000000, { message: t("max-amount") })
      .multipleOf(0.01, { message: t("amount-multiple") }),
    title: z
      .string()
      .max(500, { message: t("max-500") })
      .optional(),
    date: z.coerce.date(),
    exchangeCurrency: z.custom((value) => {
      const found = currencies.some((currency) => currency.value === value);

      if (!found) return { error: t("invalid-currency") };

      return value;
    }),
    targetCurrency: z.custom((value) => {
      const found = currencies.some((currency) => currency.value === value);

      if (!found) return { error: t("invalid-currency") };

      return value;
    }),
  });

export const createExchangeSchema = (
  t: _Translator<Record<string, any>, "errors">,
) =>
  baseExchangeSchema(t).superRefine((data, ctx) => {
    if (data.exchangeCurrency === data.targetCurrency) {
      ctx.addIssue({
        path: ["targetCurrency"],
        code: z.ZodIssueCode.custom,
        message: t("target-must-be-different"),
      });
    }
  });

export type createExchangeType = z.infer<ReturnType<typeof createExchangeSchema>>;

export const updateExchangeSchema = (
  t: _Translator<Record<string, any>, "errors">,
) =>
  baseExchangeSchema(t).extend({
    id: z
      .string()
      .min(1, { message: t("required") })
      .max(100, { message: t("max-100") }),
  });

export type updateExchangeType = z.infer<ReturnType<typeof updateExchangeSchema>>;
