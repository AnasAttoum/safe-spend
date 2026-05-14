import { currencies } from "@/config/currencies";
import { _Translator } from "next-intl";
import { z } from "zod";

export const updateUserCurrencySchema = (t: _Translator<Record<string, any>, "errors">) =>z.object({
  currency: z.custom((value) => {
    const found = currencies.some((currency) => currency.value === value);

    if (!found) throw new Error(t("invalid-currency"));

    return value;
  }),
});
