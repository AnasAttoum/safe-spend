import { getTranslations } from "next-intl/server";
import { AllCurrenciesChart } from "../components/all-currencies-chart";

export default async function AllTimeHistory() {
  const t = await getTranslations("dashboard");
  return (
    <div>
      <h3 className="text-3xl p-5">{t("all-time-history")}</h3>

      <AllCurrenciesChart />
    </div>
  );
}
