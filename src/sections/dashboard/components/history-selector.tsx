import { getHistoryDataResponseType } from "@/app/[locale]/api/history/data/route";
import { getHistoryPeriodsType } from "@/app/[locale]/api/history/periods/route";
import SkeletonWrapper from "@/components/skeleton/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Period, Timeframe } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import Chart from "./chart";
import SelectCurrency from "@/components/select/select-currency";
import { queryKey } from "@/config/query-key";

type Props = {
  timeframe: Timeframe;
  setTimeframe: (timeframe: Timeframe) => void;
  period: Period;
  setPeriod: (period: Period) => void;
  historyData: getHistoryDataResponseType;
  historyDataIsLoading: boolean;
  curr: string;
  setCurr: (val: string) => void;
};

export default function HistorySelector({
  timeframe,
  setTimeframe,
  period,
  setPeriod,
  historyData,
  historyDataIsLoading,
  curr,
  setCurr,
}: Props) {
  const { data, isLoading } = useQuery<getHistoryPeriodsType>({
    queryKey: [queryKey.overview, queryKey.history, queryKey.periods],
    queryFn: () => fetch("/api/history/periods").then((res) => res.json()),
  });

  return (
    <SkeletonWrapper isLoading={isLoading}>
      <Card className="p-5 h-150">
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div className="flex flex-wrap gap-2">
            <Tabs
              value={timeframe}
              onValueChange={(newValue) => setTimeframe(newValue as Timeframe)}
            >
              <TabsList className="grid w-full grid-cols-2 items-center h-full border">
                <TabsTrigger value="year" className="cursor-pointer">
                  Year
                </TabsTrigger>
                <TabsTrigger value="month" className="cursor-pointer">
                  Month
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <SelectCurrency
              selected={curr}
              onSelect={(newValue) => setCurr(newValue)}
            />

            <YearSelector
              period={period}
              setPeriod={setPeriod}
              years={data?.allYears || []}
            />

            {timeframe === "month" && (
              <MonthSelector period={period} setPeriod={setPeriod} />
            )}
          </div>

          <div className="flex gap-2">
            <Badge variant="outline" className="p-2">
              <div className="w-4 h-4 bg-income rounded-full" />
              Income
            </Badge>
            <Badge variant="outline" className="p-2">
              <div className="w-4 h-4 bg-expense rounded-full" />
              Expense
            </Badge>
          </div>
        </div>

        <SkeletonWrapper isLoading={historyDataIsLoading}>
          {historyData && historyData.length > 0 ? (
            <Chart data={historyData} timeframe={timeframe} />
          ) : (
            <div className="flex flex-col justify-center items-center h-full">
              <div>No data for the selected period</div>
              <p className="text-gray-500">
                Try selecting a different period or adding new transactions
              </p>
            </div>
          )}
        </SkeletonWrapper>
      </Card>
    </SkeletonWrapper>
  );
}

const YearSelector = ({
  period,
  setPeriod,
  years,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
  years: getHistoryPeriodsType["allYears"];
}) => (
  <Select
    value={period.year.toString()}
    onValueChange={(newValue) =>
      setPeriod({ year: parseInt(newValue), month: period.month })
    }
  >
    <SelectTrigger className="w-[125px]">
      <SelectValue placeholder="Years" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Years</SelectLabel>
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);

const MonthSelector = ({
  period,
  setPeriod,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
}) => (
  <Select
    value={period.month.toString()}
    onValueChange={(newValue) =>
      setPeriod({ year: period.year, month: parseInt(newValue) })
    }
  >
    <SelectTrigger className="w-[125px]">
      <SelectValue placeholder="Years" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Years</SelectLabel>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
          const monthStr = new Date(period.year, month, 1).toLocaleString(
            "default",
            { month: "long" }
          );
          return <SelectItem key={month} value={month.toString()}>{monthStr}</SelectItem>;
        })}
      </SelectGroup>
    </SelectContent>
  </Select>
);
