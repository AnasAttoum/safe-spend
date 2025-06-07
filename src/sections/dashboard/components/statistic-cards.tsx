import { Balancetype } from "@/app/api/statistics/balance/route";
import CardStatistic from "@/components/card/card-statistic";
import SkeletonWrapper from "@/components/skeleton/skeleton";
import { queryKey } from "@/config/query-key";
import { dateToUTCDate, getUTCRange } from "@/lib/date-helper";
import { useQuery } from "@tanstack/react-query";

type Props = {
  from: Date;
  to: Date;
  currency: string;
};

export default function StatisticCards({ from, to, currency }: Props) {
  const { fromUTC, toUTC } = getUTCRange(from, to);

  const { data, isLoading } = useQuery<Balancetype>({
    queryKey: [queryKey.overview, queryKey.statistics, from, to],
    queryFn: () =>
      fetch(`/api/statistics/balance?from=${fromUTC.toISOString()}&to=${toUTC.toISOString()}`).then((res) =>
        res.json()
      ),
  });

  const income = data?.find((el) => el.currency === currency)?.income || 0;
  const expense = data?.find((el) => el.currency === currency)?.expense || 0;
  const balance = income - expense || 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
        <SkeletonWrapper isLoading={isLoading}>
          <CardStatistic
            title="Income"
            icon="statistic-up"
            value={income}
            currency={currency}
          />
        </SkeletonWrapper>
        <SkeletonWrapper isLoading={isLoading}>
          <CardStatistic
            title="Expense"
            icon="statistic-down"
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
            <div key={el.currency} className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
              <SkeletonWrapper isLoading={isLoading}>
                <CardStatistic
                  title="Income"
                  icon="statistic-up"
                  value={el.income}
                  currency={el.currency}
                />
              </SkeletonWrapper>
              <SkeletonWrapper isLoading={isLoading}>
                <CardStatistic
                  title="Expense"
                  icon="statistic-down"
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
