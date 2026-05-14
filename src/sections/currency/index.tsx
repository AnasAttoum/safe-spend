import Icon from "@/components/icon/icon";
import { Separator } from "@/components/ui/separator";
import { CurrencyCard } from "./components/card";
import LocaleSwitcher from "@/components/buttons/locale-switcher";
import { getTranslations } from "next-intl/server";

type Props = {
  firstName: string;
};

export default async function CurrencyView({ firstName }: Props) {
  const t = await getTranslations("currency");

  return (
    <div className="flex flex-col gap-3 text-center">
      <h2 className="text-3xl flex justify-center items-center gap-2">
        {t("welcome")}{firstName !== "" && <>, <strong>{firstName}</strong>!</>}
        <Icon icon="welcome" size={50} />
      </h2>

      <div className="text-gray-500">
        <h3>{t("get-started")}</h3>
        <h3>{t("change-it-any-time")}</h3>
      </div>
      <LocaleSwitcher/>
      <Separator />
      <CurrencyCard />
    </div>
  );
}
