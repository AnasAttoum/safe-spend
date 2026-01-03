import React from "react";
import { Card } from "../ui/card";
import CountUp from "react-countup";
import clsx from "clsx";
import Image from "next/image";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Icon from "../icon/icon";
import { currencies } from "@/config/currencies";

type Props = {
  title: string;
  value: number;
  icon: LucideIcon | string;
  currency: string;
};

export default function CardStatistic({ title, icon: SelectedIcon, value, currency }: Props) {

  const symbol = currencies.find((curr) => curr.value === currency)?.symbol || ''

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3 h-full px-5 relative">
        {typeof SelectedIcon === 'string' ? <Icon icon={SelectedIcon} size={40} />
          : <SelectedIcon className={cn("w-10 h-10 p-1 rounded-lg",
            title.toLowerCase() === "income" && "text-income-dark",
            title.toLowerCase() === "expense" && "text-expense-dark",
          )} />}
        <div className="flex flex-col">
          <p>
            {title}
          </p>
          <CountUp end={value} decimals={Number.isInteger(value) ? 0 : 2} suffix={` ${symbol}`}
            className={clsx(
              "text-2xl font-bold transition-all duration-300 group-hover:scale-105 group-hover:translate-x-1",
              title.toLowerCase() === "income" ||
                title.toLowerCase() === "expense"
                ? `text-${title.toLowerCase()}`
                : value < 0 ? 'text-expense' : value === 0 ? 'text-safeSpend-light' : 'text-income'
            )} />
        </div>
        <Image
          src={`/assets/currencies/${currency}.png`}
          alt="Safe Spend Logo"
          width={150}
          height={100}
          className="absolute right-0 mask-gradient"
        />
      </div>
    </Card>
  );
}
