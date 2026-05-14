import { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import { defaultCurrency } from "@/config/currencies";
import Exchanges from "@/sections/exchanges";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("exchange")
  return {
    title: t("exchanges"),
  }
}

export default async function page() {

  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const userData = await prisma.user.findUnique({ where: { userId: user.id } });
  if (!userData) redirect(routes.currency);

  return <Exchanges currency={userData.currency || defaultCurrency.value} />;
}
