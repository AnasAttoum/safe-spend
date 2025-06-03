import CardBalanceTotal from "@/components/card/card-balance-total";
import SkeletonWrapper from "@/components/skeleton/skeleton";
import { useQuery } from "@tanstack/react-query";

export default function TotalBalanceCards() {
  const { data, isFetching } = useQuery({
    queryKey: ["overview", "statistics"],
    queryFn: () =>
      fetch(`/api/statistics/total`).then((res) =>
        res.json()
      ),
  });

  return (
    <div className="flex flex-col gap-2 w-full">
      <SkeletonWrapper isFetching={isFetching}>
        {data && data.map((balance: { currency: string; total: number }, index: number) => <CardBalanceTotal key={index} balance={balance} />)}
      </SkeletonWrapper>
    </div>
  );
}
