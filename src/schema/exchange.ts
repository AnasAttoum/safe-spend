import { currencies } from "@/config/currencies";
import { z } from "zod";

export const createExchangeSchema = z
  .object({
    exchangeAmount: z.coerce
      .number({
        invalid_type_error: "Amount must be a number",
        required_error: "Amount is required",
      })
      .positive("Amount must be greater than 0.")
      .multipleOf(0.01, { message: "Amount must be a multiple of 0.01." }),
    collectedAmount: z.coerce
      .number({
        invalid_type_error: "Amount must be a number",
        required_error: "Amount is required",
      })
      .positive("Amount must be greater than 0.")
      .multipleOf(0.01, { message: "Amount must be a multiple of 0.01." }),
    title: z.string().min(3).max(100),
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
  })
  .superRefine((data, ctx) => {
    if (data.exchangeCurrency === data.targetCurrency) {
      ctx.addIssue({
        path: ["targetCurrency"],
        code: z.ZodIssueCode.custom,
        message: "Target currency must be different from exchange currency.",
      });
    }
  });

export type createExchangeType = z.infer<typeof createExchangeSchema>;
