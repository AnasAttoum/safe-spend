import { Categoriestype } from "@/app/api/statistics/category/route";
import CategoryStatistic from "@/components/card/category-statistic";
import SkeletonWrapper from "@/components/skeleton/skeleton";
import { dateToUTCDate } from "@/lib/date-helper";
import { useQuery } from "@tanstack/react-query";

type Props = {
  from: Date;
  to: Date;
};

export default function CategoriesStats({ from, to }: Props) {
  const { data, isFetching } = useQuery<Categoriestype>({
    queryKey: ["overview", "statistics", "category", from, to],
    queryFn: () =>
      fetch(
        `/api/statistics/category?from=${dateToUTCDate(
          from
        )}&to=${dateToUTCDate(to)}`
      ).then((res) => res.json()),
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
      <SkeletonWrapper isFetching={isFetching}>
        <CategoryStatistic type="income" data={data || []} />
      </SkeletonWrapper>
      <SkeletonWrapper isFetching={isFetching}>
        <CategoryStatistic type="expense" data={data || []} />
      </SkeletonWrapper>
    </div>
  );
}
