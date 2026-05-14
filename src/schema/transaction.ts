import { currencies } from "@/config/currencies";
import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.coerce
    .number({
      invalid_type_error: "amount-must-ne-number",
      required_error: "required",
    })
    .positive("greater-than-0")
    .max(1000000000, { message: "max-amount" })
    .multipleOf(0.01, { message: "amount-multiple" }),
  title: z.string().min(1, { message: "required" }).max(500, { message: "max-500" }),
  description: z.string().max(500, { message: "max-500" }).optional(),
  date: z.coerce.date(),
  category: z.object({
    id: z.string().min(1, { message: "required" }),
    name: z.string().min(1, { message: "required" }).max(100, { message: "max-100" }),
    icon: z.string().max(20, { message: "max-20" }),
  }),
  type: z.union([z.literal("income"), z.literal("expense")]),
  currency: z.custom((value) => {
    const found = currencies.some((currency) => currency.value === value);

    if (!found) return { error: "invalid-currency" };

    return value;
  }),
});
export type createTransactionType = z.infer<typeof createTransactionSchema>;

export const updateTransactionSchema = createTransactionSchema.extend({
  id: z.string().min(1, { message: "required" }).max(100, { message: "max-100" }),
});

export type updateTransactionType = z.infer<typeof updateTransactionSchema>;
