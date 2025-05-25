"use client";

import { Period, Timeframe } from "@/lib/types";
import { useState } from "react";
import HistorySelector from "../components/history-selector";
import { useQuery } from "@tanstack/react-query";
import { getHistoryDataResponseType } from "@/app/api/history/data/route";

export default function History({ currency }: { currency: string }) {
  const [curr, setCurr] = useState(currency);
  const [timeframe, setTimeframe] = useState<Timeframe>("month");
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const { data, isFetching } = useQuery<getHistoryDataResponseType>({
    queryKey: ["overview", "history", timeframe, period, curr],
    queryFn: () =>
      fetch(
        `/api/history/data?timeframe=${timeframe}&month=${period.month}&year=${period.year}&currency=${curr}`
      ).then((res) => res.json()),
  });

  return (
    <div>
      <h3 className="text-3xl p-5">History</h3>

      <HistorySelector
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        period={period}
        setPeriod={setPeriod}
        historyData={data || []}
        historyDataIsFetching={isFetching}
        curr={curr}
        setCurr={setCurr}
      />
    </div>
  );
}
