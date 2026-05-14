import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("currency")
  return {
    title: t("currency"),
  }
}

export default function layout({ children }: Props) {
  return (
    <div className="h-dvh flex justify-center items-center">{children}</div>
  );
}
