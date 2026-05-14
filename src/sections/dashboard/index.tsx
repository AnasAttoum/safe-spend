import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import Head from "./views/head";
import Overview from "./views/overview";
import { defaultCurrency } from "@/config/currencies";
import History from "./views/history";
import AllTimeHistory from "./views/all-time-history";
import { DeleteDialog } from "@/components/dialog/delete-dialog";
import { Button } from "@/components/ui/button";
import { Category } from "@/generated/prisma";
import CategoryOverviewData from "./components/category-overview-data";
import CreateCategory from "@/components/dialog/create-category";
import Transactions from "../transactions";
import { getTranslations } from "next-intl/server";

export type CategoryOverview = {
  category: Category;
  transactionsCount: number;
}

export default async function Dashboard({ categoryOverview }: { categoryOverview?: CategoryOverview | null }) {
  const t = await getTranslations("category");
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const userData = await prisma.user.findUnique({ where: { userId: user.id } });
  if (!userData) redirect(routes.currency);

  return (
    <>
      {!categoryOverview && <Head
        name={user.firstName || "User"}
        currency={userData.currency || defaultCurrency.value}
      />}

      {categoryOverview && categoryOverview.category && <CategoryOverviewData categoryOverview={categoryOverview} />}
      <Overview
        currency={userData.currency || defaultCurrency.value}
        categoryId={categoryOverview?.category?.id}
      />

      {categoryOverview && categoryOverview.category && <Transactions
        currency={userData.currency || defaultCurrency.value}
        categoryOverview={categoryOverview}
      />}

      <History currency={userData.currency || defaultCurrency.value} categoryId={categoryOverview?.category?.id} />

      {!categoryOverview?.category?.id && <AllTimeHistory />}

      {categoryOverview?.category?.id &&
        <div className="flex flex-wrap items-center gap-3 w-full mt-5">
          <CreateCategory
            type={categoryOverview.category.type as "income" | "expense"}
            trigger={<Button variant="default" className="primaryBtn flex-1 py-5 uppercase">{t("update")}</Button>}
            category={categoryOverview.category}
          />
          <DeleteDialog
            item="category"
            id={categoryOverview?.category?.id}
            trigger={
              <Button className="deleteBtn flex-1 my-0!">
                {t("category.delete")}
              </Button>
            }
          />
        </div>
      }
    </>
  );
}
