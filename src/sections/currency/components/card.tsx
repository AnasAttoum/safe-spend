import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ComboBox } from "./combobox";
import { routes } from "@/config/routes";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/localization/navigation";

export async function CurrencyCard() {
  const t = await getTranslations("currency");

  return (
    <Card className="w-87.5">
      <CardHeader className="text-start">
        <CardTitle>{t("add")}</CardTitle>
        <CardDescription>
          {t("set-default")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="w-full">
            <ComboBox />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button className="w-full cursor-pointer">
          <Link href={routes.dashboard}>{t("continue")}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
