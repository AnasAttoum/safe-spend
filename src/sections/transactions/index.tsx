"use client";
import { useState } from "react";
import Head from "./views/head";
import { startOfMonth } from "date-fns";
import TransactionsTable from "./views/transactions-table";

export default function Transactions({ currency }: { currency: string }) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <Head dateRange={dateRange} setDateRange={setDateRange} currency={currency} />
      <TransactionsTable from={dateRange.from} to={dateRange.to} />
    </>
  );
}
