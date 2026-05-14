import { Metadata } from "next";
import Settings from "@/sections/settings";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("settings")
  return {
    title: t("settings"),
  }
}

export default function page() {
  return <Settings />;
}
