import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import Count from "../count-up";
import { CurrencyToday } from "@/sections/syrian-pound-today";
import { getTranslations } from "next-intl/server";

type Props = {
  currencyToday: CurrencyToday;
};

export default async function GoldTodayCard({ currencyToday }: Props) {
  const t = await getTranslations();
  const { code, buy, sell, change } = currencyToday;
  return (
    <Card className="rounded-sm transition-all duration-300 group hover:scale-101 hover:-translate-y-1 py-0">
      <div className="flex flex-col justify-between">
        <div className="flex justify-between items-center px-5 text-center text-gold font-bold py-5">
          <span >{code}</span>
          <div className="flex flex-col">
            {change !== 0 ?
              <span
                className={cn(
                  "rounded-2xl px-2",
                  change < 0 && "text-expense",
                  change > 0 && "text-income"
                )}
              >{change > 0 && '+'}{change.toFixed(2)}%</span>
              : <span></span>
            }
          </div>
        </div>
        <div className="flex justify-between items-center flex-1 px-5 bg-gold text-white py-5">
          <div className="flex flex-col">
            <span>{t("buy")}:</span>
            <span className="text-2xl font-bold">
              <Count num={buy} suffix=" £" />
            </span>
          </div>

          <div className="flex flex-col">
            <span>{t("sell")}:</span>
            <span className="text-2xl font-bold">
              <Count num={sell} suffix=" £" />
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
