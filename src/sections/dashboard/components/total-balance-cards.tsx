import CardBalanceTotal from "@/components/card/card-balance-total";
import SkeletonWrapper from "@/components/skeleton/skeleton";
import { queryKey } from "@/config/query-key";
import { useQuery } from "@tanstack/react-query";

export default function TotalBalanceCards() {
  const { data, isLoading } = useQuery({
    queryKey: [queryKey.overview, queryKey.statistics],
    queryFn: () =>
      fetch(`/api/statistics/total`).then((res) =>
        res.json()
      ),
  });

  return (
    <div className="w-full">
      <SkeletonWrapper isLoading={isLoading}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {isLoading && <CardBalanceTotal balance={{ currency: 'USD', total: 0, diff: 0 }} />}
          {data && Array.isArray(data) && data?.filter((balance) => !!balance.total || !!balance.diff).map((balance: { currency: string; total: number; diff: number }, index: number) => <CardBalanceTotal key={index} balance={balance} />)}
          {data && !Array.isArray(data) && <CardBalanceTotal balance={data} />}
        </div>
      </SkeletonWrapper>
    </div>
  );
}
