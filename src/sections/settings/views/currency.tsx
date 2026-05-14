import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComboBox } from "@/sections/currency/components/combobox";
import { getTranslations } from "next-intl/server";
import React from "react";

export default async function Currency() {
  const t = await getTranslations("currency");

  return (
    <Card>
      <CardHeader className="text-start">
        <CardTitle>{t("currency")}</CardTitle>
        <CardDescription>
          {t("set")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ComboBox />
      </CardContent>
    </Card>
  );
}
