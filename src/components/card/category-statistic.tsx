import { Categoriestype } from "@/app/[locale]/api/statistics/category/route";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { currencies, defaultCurrency } from "@/config/currencies";
import CountUp from "react-countup";
import Link from "next/link";

type Props = {
  type: "income" | "expense";
  data: Categoriestype;
};

export default function CategoryStatistic({ type, data }: Props) {
  const filteredData = data.filter((el) => el.type === type);

  return (
    <Card className="w-full py-5">
      <h3 className={`text-${type} text-lg font-bold px-5`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}s by category:
      </h3>
      {!filteredData.length ? (
        <div className="flex flex-col justify-center items-center h-full px-5">
          <div>No data for the selected period</div>
          <div className="text-gray-500">
            Try selecting a different period or try adding new {type + "s"}
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          {filteredData.map((el, index) => {
            const amount = el._sum.amount || 0;
            const total = filteredData
              .filter((data) => data.currency === el.currency)
              .reduce((acc, el) => acc + (el._sum.amount || 0), 0);
            const { symbol, color } = currencies.find((curr) => curr.value === el.currency) || defaultCurrency;
            const percentage = (amount * 100) / (total || amount);

            return (
              <Link
                key={index}
                href={{ pathname: '/', query: { categoryId: el.categoryId } }}
                className="flex flex-col gap-2 p-4 hover:bg-gray-100 dark:hover:bg-neutral-950"
              >
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    {el.category?.icon} {el.category?.name}
                    <span className={"text-white rounded-md text-xs px-1"} style={{ backgroundColor: color }}>
                      {percentage.toFixed(1)}% {el.currency}
                    </span>
                  </div>

                  <div>
                    <CountUp end={amount} decimals={Number.isInteger(amount) ? 0 : 2} suffix={` ${symbol}`} />
                    {/* {amount} {symbol} */}
                  </div>
                </div>

                <Progress
                  value={percentage}
                  className={
                    type === "income"
                      ? "[&>div]:bg-income"
                      : "[&>div]:bg-expense"
                  }
                />
              </Link>
            );
          })}
        </div>
      )}
    </Card>
  );
}
