"use client";

import { Period, Timeframe } from "@/lib/types";
import { useState } from "react";
import HistorySelector from "../components/history-selector";
import { useQuery } from "@tanstack/react-query";
import { getHistoryDataResponseType } from "@/app/[locale]/api/history/data/route";
import { queryKey } from "@/config/query-key";
import { useTranslations } from "next-intl";

export default function History({ currency, categoryId }: { currency: string; categoryId?: string }) {
  const t = useTranslations("dashboard")
  const [curr, setCurr] = useState(currency);
  const [timeframe, setTimeframe] = useState<Timeframe>("year");
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const { data, isLoading } = useQuery<getHistoryDataResponseType>({
    queryKey: [queryKey.overview, queryKey.history, timeframe, period, curr, categoryId],
    queryFn: () =>
      fetch(
        `/api/history/data?timeframe=${timeframe}&month=${period.month}&year=${period.year}&currency=${curr}&categoryId=${categoryId}`
      ).then((res) => res.json()),
  });

  return (
    <div>
      <h3 className="text-3xl p-5">{t("history")}</h3>

      <HistorySelector
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        period={period}
        setPeriod={setPeriod}
        historyData={data || []}
        historyDataIsLoading={isLoading}
        curr={curr}
        setCurr={setCurr}
      />
    </div>
  );
}
