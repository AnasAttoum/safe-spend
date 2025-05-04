"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { startOfMonth } from "date-fns";
import { useState } from "react";
import StatisticCards from "../components/statistic-cards";

export default function Overview() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-3 p-5">
        <h3 className="text-3xl">Overview</h3>
        <DateRangePicker
          initialDateFrom={dateRange.from}
          initialDateTo={dateRange.to}
          showCompare={false}
          onUpdate={(values) => {
            const { from, to } = values.range;
            if (!from || !to) return;
            setDateRange({ from, to });
          }}
        />
      </div>

      <StatisticCards
        from={dateRange.from}
        to={dateRange.to}
      />
    </>
  );
}
