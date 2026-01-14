import React from "react";
import { Card } from "../ui/card";
import CountUp from "react-countup";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { currencies } from "@/config/currencies";

type Props = {
  balance: { currency: string; total: number; diff: number }
};

export default function CardBalanceTotal({ balance }: Props) {

  const { currency = '', total = 0, diff = 0 } = balance

  const currObj = currencies.find((curr) => curr.value === currency) || { label: '', symbol: '' }
  const { label, symbol } = currObj

  return (
    <Card className="bg-linear-to-r from-safeSpend-primary to-safeSpend-secondary overflow-hidden group min-h-36 transition-all duration-300 hover:scale-101 hover:-translate-y-1">
      <div className="flex items-center gap-3 px-5 relative">
        <Image
          src="/assets/safeSpend.svg"
          alt="Safe Spend Logo"
          width={175}
          height={175}
          className="absolute right-0 opacity-20"
        />
        <div className="flex flex-col gap-2 w-full text-2xl md:text-3xl text-white font-bold">
          <p className="text-sm uppercase text-gray-300">Total {label} balance</p>
          <CountUp end={total} decimals={Number.isInteger(total) ? 0 : 2} suffix={` ${symbol}`} className="transition-all duration-300 group-hover:scale-105 group-hover:translate-x-3" />
          {!!diff && <small className="text-sm font-light flex items-center gap-2">
            <span className={cn("rounded-2xl px-2", diff > 0 ? 'bg-income' : 'bg-expense')}>{diff > 0 && '+'}{diff.toLocaleString('en-US')}</span>
            <small>This month</small>
          </small>}
        </div>
      </div>
    </Card>
  );
}
