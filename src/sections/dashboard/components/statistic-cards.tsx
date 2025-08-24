import { Balancetype } from "@/app/api/statistics/balance/route";
import CardStatistic from "@/components/card/card-statistic";
import SkeletonWrapper from "@/components/skeleton/skeleton";
import { queryKey } from "@/config/query-key";
import { getUTCRange } from "@/lib/date-helper";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp } from "lucide-react";

type Props = {
  from: Date;
  to: Date;
  currency: string;
  categoryId?: string;
};

export default function StatisticCards({ from, to, currency, categoryId }: Props) {
  const { fromUTC, toUTC } = getUTCRange(from, to);

  const { data, isLoading } = useQuery<Balancetype>({
    queryKey: [queryKey.overview, queryKey.statistics, from, to, categoryId],
    queryFn: () =>
      fetch(`/api/statistics/balance?from=${fromUTC.toISOString()}&to=${toUTC.toISOString()}&categoryId=${categoryId}`).then((res) =>
        res.json()
  ),
});

  const income = (data ?? [])?.find((el) => el?.currency === currency)?.income || 0;
  const expense = (data ?? [])?.find((el) => el?.currency === currency)?.expense || 0;
  const balance = income - expense || 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
        <SkeletonWrapper isLoading={isLoading}>
          <CardStatistic
            title="Income"
            icon={TrendingUp}
            value={income}
            currency={currency}
          />
        </SkeletonWrapper>
        <SkeletonWrapper isLoading={isLoading}>
          <CardStatistic
            title="Expense"
            icon={TrendingDown}
            value={expense}
            currency={currency}
          />
        </SkeletonWrapper>
        <SkeletonWrapper isLoading={isLoading}>
          <CardStatistic
            title="Balance"
            icon="calculator"
            value={balance}
            currency={currency}
          />
        </SkeletonWrapper>
      </div>

      {data &&
        data
          ?.filter((el) => el.currency !== currency)
          .map((el) => (
            <div key={el.currency} className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
              <SkeletonWrapper isLoading={isLoading}>
                <CardStatistic
                  title="Income"
                  icon={TrendingUp}
                  value={el.income}
                  currency={el.currency}
                />
              </SkeletonWrapper>
              <SkeletonWrapper isLoading={isLoading}>
                <CardStatistic
                  title="Expense"
                  icon={TrendingDown}
                  value={el.expense}
                  currency={el.currency}
                />
              </SkeletonWrapper>
              <SkeletonWrapper isLoading={isLoading}>
                <CardStatistic
                  title="Balance"
                  icon="calculator"
                  value={el.income - el.expense}
                  currency={el.currency}
                />
              </SkeletonWrapper>
            </div>
          ))}
    </div>
  );
}
