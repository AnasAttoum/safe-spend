import { currencies } from "@/config/currencies";
import { z } from "zod";

export const baseExchangeSchema = z.object({
  exchangeAmount: z.coerce
    .number({
      invalid_type_error: "amount-must-ne-number",
      required_error: "required",
    })
    .positive("greater-than-0")
    .max(1000000000, { message: "max-amount" })
    .multipleOf(0.01, { message: "amount-multiple" }),
  collectedAmount: z.coerce
    .number({
      invalid_type_error: "amount-must-ne-number",
      required_error: "required",
    })
    .positive("greater-than-0")
    .max(1000000000, { message: "max-amount" })
    .multipleOf(0.01, { message: "amount-multiple" }),
  title: z.string().max(500, { message: "max-500" }).optional(),
  date: z.coerce.date(),
  exchangeCurrency: z.custom((value) => {
    const found = currencies.some((currency) => currency.value === value);

    if (!found) return { error: "invalid-currency" };

    return value;
  }),
  targetCurrency: z.custom((value) => {
    const found = currencies.some((currency) => currency.value === value);

    if (!found) return { error: "invalid-currency" };

    return value;
  }),
});

export const createExchangeSchema = baseExchangeSchema.superRefine(
  (data, ctx) => {
    if (data.exchangeCurrency === data.targetCurrency) {
      ctx.addIssue({
        path: ["targetCurrency"],
        code: z.ZodIssueCode.custom,
        message: "target-must-be-different",
      });
    }
  },
);

export type createExchangeType = z.infer<typeof createExchangeSchema>;

export const updateExchangeSchema = baseExchangeSchema.extend({
  id: z.string().min(1, { message: "required" }).max(100, { message: "max-100" }),
});

export type updateExchangeType = z.infer<typeof updateExchangeSchema>;
