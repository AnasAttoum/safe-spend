import { cn } from "@/lib/utils";
import type { CategoryOverview } from "..";
import { getTranslations } from "next-intl/server";

export default async function CategoryOverviewData({ categoryOverview }: { categoryOverview: CategoryOverview }) {
    const t = await getTranslations("transaction");
    return (
        <div className="flex gap-3 items-center p-5 w-full">
            <span className="text-7xl" >{categoryOverview.category.icon}</span>
            <div className="flex flex-col w-full truncate">
                <p className={cn("font-bold w-full truncate",
                    categoryOverview.category.type === 'income' ? 'text-income' : 'text-expense'
                )}>{categoryOverview.category.name}</p>
                <small className="text-gray-500">({categoryOverview.transactionsCount} {categoryOverview.transactionsCount > 1 ? t("transactions") : t("Transaction")})</small>
            </div>
        </div>
    )
}