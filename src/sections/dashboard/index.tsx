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
import { cn } from "@/lib/utils";

export type CategoryOverview = {
  category: Category;
  transactionsCount: number;
}

export default async function Dashboard({ categoryOverview }: { categoryOverview?: CategoryOverview | null }) {
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

      {categoryOverview && categoryOverview.category && <div className="flex gap-3 items-center p-5 w-full">
        <span className="text-7xl" >{categoryOverview.category.icon}</span>
        <div className="flex flex-col w-full truncate">
          <p className={cn("font-bold w-full truncate",
            categoryOverview.category.type === 'income' ? 'text-income' : 'text-expense'
          )}>{categoryOverview.category.name}</p>
          <small className="text-gray-500">({categoryOverview.transactionsCount} Transaction{categoryOverview.transactionsCount > 1 && "s"})</small>
        </div>
      </div>}
      <Overview
        currency={userData.currency || defaultCurrency.value}
        categoryId={categoryOverview?.category?.id}
      />

      <History currency={userData.currency || defaultCurrency.value} categoryId={categoryOverview?.category?.id} />

      {!categoryOverview?.category?.id && <AllTimeHistory />}

      {categoryOverview?.category?.id && <DeleteDialog
        item="category"
        id={categoryOverview?.category?.id}
        trigger={
          <Button className="deleteBtn w-full">
            Delete Category
          </Button>
        }
      />}
    </>
  );
}
