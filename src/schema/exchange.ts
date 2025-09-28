import { currencies } from "@/config/currencies";
import { z } from "zod";

export const baseExchangeSchema = z.object({
  exchangeAmount: z.coerce
    .number({
      invalid_type_error: "Amount must be a number",
      required_error: "Amount is required",
    })
    .positive("Amount must be greater than 0")
    .max(1000000000, { message: "Max exchange amount is 1000000000" })
    .multipleOf(0.01, { message: "Amount must be a multiple of 0.01" }),
  collectedAmount: z.coerce
    .number({
      invalid_type_error: "Amount must be a number",
      required_error: "Amount is required",
    })
    .positive("Amount must be greater than 0")
    .max(1000000000, { message: "Max collected amount is 1000000000" })
    .multipleOf(0.01, { message: "Amount must be a multiple of 0.01" }),
  title: z.string().max(500).optional(),
  date: z.coerce.date(),
  exchangeCurrency: z.custom((value) => {
    const found = currencies.some((currency) => currency.value === value);

    if (!found) return { error: `Invalid currency: ${value}` };

    return value;
  }),
  targetCurrency: z.custom((value) => {
    const found = currencies.some((currency) => currency.value === value);

    if (!found) return { error: `Invalid currency: ${value}` };

    return value;
  }),
});

export const createExchangeSchema = baseExchangeSchema.superRefine(
  (data, ctx) => {
    if (data.exchangeCurrency === data.targetCurrency) {
      ctx.addIssue({
        path: ["targetCurrency"],
        code: z.ZodIssueCode.custom,
        message: "Target currency must be different from exchange currency.",
      });
    }
  }
);

export type createExchangeType = z.infer<typeof createExchangeSchema>;

export const updateExchangeSchema = baseExchangeSchema.extend({
  id: z.string().min(1).max(100),
});

export type updateExchangeType = z.infer<typeof updateExchangeSchema>;
