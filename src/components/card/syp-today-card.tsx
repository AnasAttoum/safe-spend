import { capitalizeWords, cn } from "@/lib/utils";
import { Card } from "../ui/card";
import { CurrencyToday } from "@/sections/syrian-pound-today";
import Count from "../count-up";
import { getTranslations } from "next-intl/server";

type Props = {
  currencyToday: CurrencyToday;
};
const currencyToCountry: Record<string, string> = {
  USD: "US", EUR: "EU", TRY: "TR", SAR: "SA", AED: "AE",
  EGP: "EG", LYD: "LY", JOD: "JO", KWD: "KW", GBP: "GB",
  AUD: "AU", CAD: "CA", CHF: "CH", DKK: "DK", DZD: "DZ",
};

const getFlagEmoji = (currencyCode: string) => {
  const countryCode = currencyToCountry[currencyCode.toUpperCase()];
  if (!countryCode) return "🏳️";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export default async function SYPTodayCard({ currencyToday }: Props) {
  const t = await getTranslations();
  const { code, buy, sell, change } = currencyToday;

  return (
    <Card className="rounded-sm transition-all duration-300 group hover:scale-101 hover:-translate-y-1 py-0">
      <div className="flex flex-col justify-between">
        <div className="flex justify-between px-5 text-center text-safeSpend-primary font-bold py-5">
          <span className="text-left">{capitalizeWords(code)}</span>
          {change !== 0 ?
            <span
              className={cn(
                "rounded-2xl px-2",
                change < 0 && "text-expense",
                change > 0 && "text-income"
              )}
            >{change > 0 && '+'}{change}%</span>
            : <span></span>
          }
        </div>
        <div className="flex justify-between items-center flex-1 px-5 bg-safeSpend-primary text-white py-5">
          <div>
            <span>{t("buy")}: &nbsp;</span>
            <span className="text-2xl font-bold">
              <Count num={buy} />
            </span>
          </div>
          <div className="text-2xl flag">{getFlagEmoji(code)}</div>
          <div>
            <span>{t("sell")}: &nbsp;</span>
            <span className="text-2xl font-bold">
              <Count num={sell} />
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
