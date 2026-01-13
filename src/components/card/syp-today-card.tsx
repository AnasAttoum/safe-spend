import { capitalizeWords, cn } from "@/lib/utils";
import { Card } from "../ui/card";
import { currencyToday } from "@/sections/syrian-pound-today";

type Props = {
  currencyToday: currencyToday;
};

export default function SYPTodayCard({ currencyToday }: Props) {
  const { slug, name_ar, flag, cities: { damascus: { buy, sell, change } } } = currencyToday;
  return (
    <Card className="rounded-sm transition-all duration-300 group hover:scale-101 hover:-translate-y-1 py-0">
      <div className="flex flex-col justify-between">
        <div className="grid grid-cols-3 px-5 text-center text-safeSpend-primary font-bold py-5">
          <span className="text-left">{capitalizeWords(slug)}</span>
          {change !== 0 ?
            <span
              className={cn(
                "rounded-2xl px-2",
                change < 0 && "text-expense",
                change > 0 && "text-income"
              )}
            >{change < 0 && '-'}{change > 0 && '+'}{change}%</span>
            : <span></span>
          }
          <span className="text-right">{name_ar}</span>
        </div>
        <div className="flex justify-between items-center flex-1 px-5 bg-safeSpend-primary text-white py-5">
          <div>
            <span>Buy: &nbsp;</span>
            <span className="text-2xl font-bold">{buy}</span>
          </div>
          <div className="text-2xl">{flag}</div>
          <div>
            <span>Sell: &nbsp;</span>
            <span className="text-2xl font-bold">{sell}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
