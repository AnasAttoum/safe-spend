import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import { currencyToday } from "@/sections/syrian-pound-today";

type Props = {
  currencyToday: currencyToday;
};

export default function SYPTodayCard({ currencyToday }: Props) {
  const { name = "", ar_name = "", ask = "", bid = "", arrow = "1", change_percentage = "" } = currencyToday;
  return (
    <Card className="rounded-sm transition-all duration-300 group hover:scale-101 hover:-translate-y-1 py-0">
      <div className="flex flex-col justify-between">
        <div className="grid grid-cols-3 px-5 text-center text-safeSpend-primary font-bold py-5">
          <span className="text-left">{name}</span>
          {change_percentage !== '0.00' ?
            <span
              className={cn(
                "rounded-2xl px-2",
                arrow === "0" && "text-expense",
                arrow === "1" && "text-income"
              )}
            >{arrow === "0" && '-'}{arrow === "1" && '+'}{change_percentage}%</span>
            : <span></span>
          }
          <span className="text-right">{ar_name}</span>
        </div>
        <div className="flex justify-between items-center flex-1 px-5 bg-safeSpend-primary text-white py-5">
          <div>
            <span>Buy: &nbsp;</span>
            <span className="text-2xl font-bold">{ask}</span>
          </div>
          <div>
            <span>Sell: &nbsp;</span>
            <span className="text-2xl font-bold">{bid}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
