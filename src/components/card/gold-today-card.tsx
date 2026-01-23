import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import Count from "../count-up";
import { goldSYPToday, karatToday } from "@/sections/gold-today";

type Props = {
  karatToday: karatToday;
  goldSYP: goldSYPToday;
};

export default function GoldTodayCard({ karatToday, goldSYP }: Props) {
  const { karat, change, price_per_gram, price_per_ounce } = karatToday;
  const syp = goldSYP[karat.toLowerCase() + ":damascus"];
  const { buy, sell, change: changeSYP } = syp;
  return (
    <Card className="rounded-sm transition-all duration-300 group hover:scale-101 hover:-translate-y-1 py-0">
      <div className="flex flex-col justify-between">
        <div className="flex justify-between items-center px-5 text-center text-gold font-bold py-5">
          <span >{karat}</span>
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
            {changeSYP !== 0 ?
              <span
                className={cn(
                  "rounded-2xl px-2",
                  change < 0 && "text-expense",
                  change > 0 && "text-income"
                )}
              >{changeSYP > 0 && '+'}{changeSYP.toFixed(2)}%</span>
              : <span></span>
            }
          </div>
        </div>
        <div className="flex justify-between items-center flex-1 px-5 bg-gold text-white py-5">
          <div className="flex flex-col">
            <span>Gram:</span>
            <span className="text-2xl font-bold">
              <Count num={price_per_gram} suffix=" $" />
            </span>
          </div>
          <div className="flex flex-col">
            <span>Ounce:</span>
            <span className="text-2xl font-bold">
              <Count num={price_per_ounce} suffix=" $" />
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center flex-1 px-5 bg-gold/90 text-white py-5">
          <div className="flex flex-col">
            <span>Buy:</span>
            <span className="text-2xl font-bold">
              <Count num={buy} suffix=" £" />
            </span>
          </div>

          <div className="flex flex-col">
            <span>Sell:</span>
            <span className="text-2xl font-bold">
              <Count num={sell} suffix=" £" />
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
