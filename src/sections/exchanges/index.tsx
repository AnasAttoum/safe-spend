"use client";
import { useState } from "react";
import Head from "./views/head";
import { startOfMonth } from "date-fns";
import ExchangesTable from "./views/exchanges-table";

export default function Exchanges({ currency }: { currency: string }) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <Head dateRange={dateRange} setDateRange={setDateRange} currency={currency} />
      <ExchangesTable from={dateRange.from} to={dateRange.to} />
    </>
  );
}
