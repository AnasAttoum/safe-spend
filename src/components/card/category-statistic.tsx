import { Categoriestype } from "@/app/api/statistics/category/route";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";

type Props = {
  type: "income" | "expense";
  data: Categoriestype;
};

export default function CategoryStatistic({ type, data }: Props) {
  const filteredData = data.filter((el) => el.type === type);
  const total = filteredData.reduce(
    (acc, el) => acc + (el._sum.amount || 0),
    0
  );

  return (
    <Card className="h-60 w-full p-5">
      <h3 className={`text-${type} text-lg font-bold`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}s by category:
      </h3>
      {!filteredData.length ? (
        <div className="flex flex-col justify-center items-center h-full">
          <div>No data for the selected period</div>
          <div className="text-gray-500">
            Try selecting a different period or try adding new {type + "s"}
          </div>
        </div>
      ) : (
        <ScrollArea className="h-36 px-4">
          <div className="flex flex-col gap-4">
            {filteredData.map((el) => {
              const amount = el._sum.amount || 0;
              const percentage = (amount * 100) / (total || amount);
              return (
                <div key={el.category} className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      {el.categoryIcon} {el.category}
                      <span className="text-blue-primary text-xs">
                        ({percentage.toFixed(2)}%)
                      </span>
                    </div>

                    <div>{amount}</div>
                  </div>

                  <Progress
                    value={percentage}
                    className={`[&>div]:bg-${type}`}
                  />
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </Card>
  );
}
