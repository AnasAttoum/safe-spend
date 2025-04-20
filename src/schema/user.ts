import { currencies } from "@/config/currencies";
import { z } from "zod";

export const updateUserCurrencySchema = z.object({
  currency: z.custom((value) => {
    const found = currencies.some((currency) => currency.value === value);

    if (!found) throw new Error(`Invalid currency: ${value}`);

    return value;
  }),
});
