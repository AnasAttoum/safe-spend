import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import Head from "./sections/head";
import Overview from "./sections/overview";
import { defaultCurrency } from "@/config/currencies";
import History from "./sections/history";

export default async function Dashboard() {
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
      <Overview currency={userData.currency || defaultCurrency.value} />

      <History currency={userData.currency || defaultCurrency.value} />
    </>
  );
}
