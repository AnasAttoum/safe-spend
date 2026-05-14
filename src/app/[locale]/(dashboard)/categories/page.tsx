import { Metadata } from "next";
import Categories from "@/sections/categories";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("category")
  return {
    title: t("categories"),
  }
}

export default function page() {
  return <Categories />;
}
