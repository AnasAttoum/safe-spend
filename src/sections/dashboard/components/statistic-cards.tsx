import { Balancetype } from "@/app/api/statistics/balance/route";
import CardStatistic from "@/components/card/card-statistic";
import SkeletonWrapper from "@/components/skeleton/skeleton";
import { currencies, defaultLang } from "@/config/currencies";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

type Props = {
  from: Date;
  to: Date;
  currency: string;
};

export default function StatisticCards({ from, to, currency }: Props) {
  const { data, isFetching } = useQuery<Balancetype>({
    queryKey: ["overview", "statistics", from, to],
    queryFn: () =>
      fetch(`/api/statistics/balance?from=${from}&to=${to}`).then((res) =>
        res.json()
      ),
  });  

  const income = data?.income || 0;
  const expense = data?.expense || 0;
  const balance = income - expense;


  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
      <SkeletonWrapper isFetching={isFetching}>
        <CardStatistic title="income" icon="statistic-up" value={income} />
      </SkeletonWrapper>
      <SkeletonWrapper isFetching={isFetching}>
        <CardStatistic title="Expense" icon="statistic-down" value={expense} />
      </SkeletonWrapper>
      <SkeletonWrapper isFetching={isFetching}>
        <CardStatistic title="Balance" icon="calculator" value={balance} />
      </SkeletonWrapper>
    </div>
  );
}
