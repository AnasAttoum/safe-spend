"use client";

import CategoryCard from "@/components/card/category-card";
import CreateCategory from "@/components/dialog/create-category";
import SkeletonWrapper from "@/components/skeleton/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { queryKey } from "@/config/query-key";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Zap } from "lucide-react";

type Props = {
  type: "income" | "expense";
};

export default function CategoryList({ type }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: [queryKey.category, type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const dataAvailable = data && Array.isArray(data) && data.length;

  return (
    <SkeletonWrapper isLoading={isLoading}>
      <Card>
        <CardHeader className="text-start">
          <CardTitle className="flex justify-between">
            <div className="flex items-center gap-3">
              {type === "income" ? <Sparkles className="w-4 h-4" /> : <Zap className="w-4 h-4" />}

              <div>
                {type === "income" ? (
                  <div>
                    <span className="text-income">Incomes</span> Categories
                  </div>
                ) : (
                  <div>
                    <span className="text-expense">Expences</span> Categories
                  </div>
                )}
                <small className="text-gray-500">Sorted by name</small>
              </div>
            </div>
            <CreateCategory type={type} />
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          {!dataAvailable ? (
            <p className="text-center text-gray-500">
              Create one to get started...
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {data.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </SkeletonWrapper>
  );
}
