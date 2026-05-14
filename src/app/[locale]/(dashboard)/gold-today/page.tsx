import { Metadata } from "next";
import GoldToday from "@/sections/gold-today";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return {
    title: t("gold-today"),
  }
}

export default function page() {
  return <GoldToday />;
}
