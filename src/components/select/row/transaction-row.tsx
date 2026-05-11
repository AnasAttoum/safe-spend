import { currencies } from "@/config/currencies";
import { Transaction } from "@/generated/prisma";
import React from "react";

type Props = {
  transaction: Transaction;
};

export default function TransactionRow({ transaction }: Props) {
  return (
    <div className="flex justify-between items-center min-w-0 w-85 gap-2">
      <span className="text-left truncate flex-3">{transaction.title}</span>
      <span className="text-right flex-1">{transaction.amount} {currencies.find((el) => el.value === transaction.currency)?.symbol}</span>
    </div>
  );
}
