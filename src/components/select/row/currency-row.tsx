import { currencies, Currency, defaultCurrency } from "@/config/currencies";
import React from "react";

type Props = {
  currency: string | Currency;
};

export default function CurrencyRow({ currency }: Props) {
  const currencyObj =
    typeof currency !== "string" &&
    currency?.label &&
    currency?.locale &&
    currency?.locale
      ? currency
      : currencies.find((curr) => curr.value === currency) || defaultCurrency;

  return (
    <div className="flex items-center gap-2">
      <span>{currencyObj.label}</span>
    </div>
  );
}
