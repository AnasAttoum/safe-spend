import { Metadata } from "next";
import SyrianPoundToday from "@/sections/syrian-pound-today";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return {
    title: t("syrian-pound-today"),
  }
}

export default function page() {
  return <SyrianPoundToday />;
}
