import { Balancetype } from "@/app/api/statistics/balance/route";
import CardStatistic from "@/components/card/card-statistic";
import SkeletonWrapper from "@/components/skeleton/skeleton";
import { dateToUTCDate } from "@/lib/date-helper";
import { useQuery } from "@tanstack/react-query";

type Props = {
  from: Date;
  to: Date;
  currency: string;
};

export default function StatisticCards({ from, to, currency }: Props) {
  const { data, isFetching } = useQuery<Balancetype>({
    queryKey: ["overview", "statistics", from, to],
    queryFn: () =>
      fetch(`/api/statistics/balance?from=${dateToUTCDate(from)}&to=${dateToUTCDate(to)}`).then((res) =>
        res.json()
      ),
  });

  const income = data?.find((el) => el.currency === currency)?.income || 0;
  const expense = data?.find((el) => el.currency === currency)?.expense || 0;
  const balance = income - expense || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
      <SkeletonWrapper isFetching={isFetching}>
        <CardStatistic
          title="Income"
          icon="statistic-up"
          value={income}
          currency={currency}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isFetching={isFetching}>
        <CardStatistic
          title="Expense"
          icon="statistic-down"
          value={expense}
          currency={currency}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isFetching={isFetching}>
        <CardStatistic
          title="Balance"
          icon="calculator"
          value={balance}
          currency={currency}
        />
      </SkeletonWrapper>

      {data &&
        data
          ?.filter((el) => el.currency !== currency)
          .map((el) => (
            <>
              <SkeletonWrapper isFetching={isFetching}>
                <CardStatistic
                  title="Income"
                  icon="statistic-up"
                  value={el.income}
                  currency={el.currency}
                />
              </SkeletonWrapper>
              <SkeletonWrapper isFetching={isFetching}>
                <CardStatistic
                  title="Expense"
                  icon="statistic-down"
                  value={el.expense}
                  currency={el.currency}
                />
              </SkeletonWrapper>
              <SkeletonWrapper isFetching={isFetching}>
                <CardStatistic
                  title="Balance"
                  icon="calculator"
                  value={el.income - el.expense}
                  currency={el.currency}
                />
              </SkeletonWrapper>
            </>
          ))}
    </div>
  );
}
