"use client";

import { ReactNode, useState } from "react";
import Head from "./views/head";
import { startOfMonth } from "date-fns";
import TransactionsTable from "./views/transactions-table";
import { CategoryOverview } from "../dashboard";
import { Card } from "@/components/ui/card";

export default function Transactions({ currency, categoryOverview }: { currency: string; categoryOverview?: CategoryOverview }) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <Head dateRange={dateRange} setDateRange={setDateRange} currency={currency} category={!!categoryOverview} />
      <CardWrapper category={!!categoryOverview}>
        <TransactionsTable from={dateRange.from} to={dateRange.to} categoryOverview={categoryOverview} />
      </CardWrapper>
    </>
  );
}

const CardWrapper = ({ category, children }: { category: boolean; children: ReactNode }) => {
  if (category)
    return <Card className="p-5">{children}</Card>;
  return children;
}