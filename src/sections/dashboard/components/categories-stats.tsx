import { Categoriestype } from "@/app/api/statistics/category/route";
import CategoryStatistic from "@/components/card/category-statistic";
import SkeletonWrapper from "@/components/skeleton/skeleton";
import { queryKey } from "@/config/query-key";
import { getUTCRange } from "@/lib/date-helper";
import { useQuery } from "@tanstack/react-query";

type Props = {
  from: Date;
  to: Date;
};

export default function CategoriesStats({ from, to }: Props) {
  const { fromUTC, toUTC } = getUTCRange(from, to);

  const { data, isLoading } = useQuery<Categoriestype>({
    queryKey: [queryKey.overview, queryKey.statistics, queryKey.category, from, to],
    queryFn: () =>
      fetch(
        `/api/statistics/category?from=${fromUTC.toISOString()}&to=${toUTC.toISOString()}`
      ).then((res) => res.json()),
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
      <SkeletonWrapper isLoading={isLoading}>
        <CategoryStatistic type="income" data={data || []} />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={isLoading}>
        <CategoryStatistic type="expense" data={data || []} />
      </SkeletonWrapper>
    </div>
  );
}
