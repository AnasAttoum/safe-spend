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

export default async function Dashboard({ categoryId }: { categoryId?: string }) {
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const userData = await prisma.user.findUnique({ where: { userId: user.id } });
  if (!userData) redirect(routes.currency);

  return (
    <>
      <Head
        name={user.firstName || "User"}
        currency={userData.currency || defaultCurrency.value}
      />
      <Overview
        currency={userData.currency || defaultCurrency.value}
        categoryId={categoryId}
      />

      <History currency={userData.currency || defaultCurrency.value} categoryId={categoryId} />

      {!categoryId && <AllTimeHistory />}

      {categoryId && <DeleteDialog
        item="category"
        id={categoryId}
        trigger={
          <Button className="deleteBtn w-full">
            Delete Category
          </Button>
        }
      />}
    </>
  );
}
