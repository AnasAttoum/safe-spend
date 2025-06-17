import React from "react";
import { Card } from "../ui/card";
import Icon from "../icon/icon";
import CountUp from "react-countup";
import clsx from "clsx";
import Image from "next/image";

type Props = {
  title: string;
  value: number;
  icon: string;
  currency: string;
};

export default function CardStatistic({ title, icon, value, currency }: Props) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3 px-5 relative">
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
          <CountUp end={value} decimals={Number.isInteger(value) ? 0 : 2} suffix={` ${currency}`} />
        </div>
        <Image
          src={`/assets/currencies/${currency}.png`}
          alt="Safe Spend Logo"
          width={150}
          height={100}
          className="absolute right-0 opacity-25 mask-gradient"
        />
      </div>
    </Card>
  );
}
