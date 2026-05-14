import { currencies } from "@/config/currencies";
import { z } from "zod";

export const getHistoryDataSchema = z.object({
  timeframe: z.enum(["month", "year"]),
  month: z.coerce.number().min(0, { message: "required" }).max(11).default(0),
  year: z.coerce.number().min(2000),
  currency: z.custom((value) => {
    const found = currencies.some((currency) => currency.value === value);

    if (!found) return { error: "invalid-currency" };

    return value;
  }),
  categoryId: z.string().min(1).max(100).optional().nullable(),
});

export type GetHistoryDataSchemaType = z.infer<typeof getHistoryDataSchema>;
