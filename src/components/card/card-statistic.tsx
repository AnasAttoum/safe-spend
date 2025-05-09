import React from "react";
import { Card } from "../ui/card";
import Icon from "../icon/icon";
import CountUp from "react-countup";
import clsx from "clsx";

type Props = {
  title: string;
  value: number;
  icon: string;
  currency: string;
};

export default function CardStatistic({ title, icon, value, currency }: Props) {
  return (
    <Card>
      <div className="flex gap-3 px-5">
        <Icon icon={icon} size={40} />
        <div className="flex flex-col">
          <p
            className={clsx(
              "font-bold",
              title.toLowerCase() === "income" ||
                title.toLowerCase() === "expense"
                ? `text-${title.toLowerCase()}`
                : "text-blue-primary"
            )}
          >
            {title}
          </p>
          <div>
            <CountUp end={value} />
            &nbsp;{currency}
          </div>
        </div>
      </div>
    </Card>
  );
}
