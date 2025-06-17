import { currencies } from "@/config/currencies";
import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.coerce
    .number({
      invalid_type_error: "Amount must be a number",
      required_error: "Amount is required",
    })
    .positive("Amount must be greater than 0")
    .max(1000000000, { message: "Max transaction amount is 1000000000" })
    .multipleOf(0.01, { message: "Amount must be a multiple of 0.01" }),
  title: z.string().min(3).max(100),
  date: z.coerce.date(),
  categoryId: z.string().min(3),
  type: z.union([z.literal("income"), z.literal("expense")]),
  currency: z.custom((value) => {
    const found = currencies.some((currency) => currency.value === value);

    if (!found) return { error: `Invalid currency: ${value}` };

    return value;
  }),
});

export type createTransactionType = z.infer<typeof createTransactionSchema>;
