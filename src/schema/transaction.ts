import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.coerce
    .number({
      invalid_type_error: "Amount must be a number",
      required_error: "Amount is required",
    })
    .positive("Amount must be greater than 0.")
    .multipleOf(0.01, { message: "Amount must be a multiple of 0.01." }),
  title: z.string().optional(),
  date: z.coerce.date(),
  category: z.string(),
  type: z.union([z.literal("income"), z.literal("expense")]),
});

export type createTransactionType = z.infer<typeof createTransactionSchema>;
