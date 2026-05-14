import { Metadata } from "next";
import Dashboard from "@/sections/dashboard";
import { getCategory } from "@/actions/category";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ categoryId?: string }> }): Promise<Metadata> {
  const t = await getTranslations("dashboard")
  const { categoryId } = await searchParams;
  const response = await getCategory(categoryId || '')

  return {
    title: response?.category?.name || t("dashboard"),
  }
}

export default async function page({ searchParams }: { searchParams: Promise<{ categoryId?: string }> }) {
  const { categoryId } = await searchParams;
  const response = await getCategory(categoryId || '')

  return <Dashboard categoryOverview={response} />;
}
