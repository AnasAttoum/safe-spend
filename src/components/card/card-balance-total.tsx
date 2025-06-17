import React from "react";
import { Card } from "../ui/card";
import CountUp from "react-countup";
import Image from "next/image";

type Props = {
  balance: { currency: string; total: number }
};

export default function CardBalanceTotal({ balance }: Props) {

  const { currency = '', total = 0 } = balance

  return (
    <Card className="bg-blue-secondary overflow-hidden border border-blue-primary">
      <div className="flex items-center gap-3 px-5 relative">
        <Image
          src="/assets/safeSpend.svg"
          alt="Safe Spend Logo"
          width={150}
          height={150}
          className="absolute right-0 opacity-20"
        />
        <div className="flex flex-wrap justify-center w-full text-2xl md:text-3xl text-white font-bold gap-2">
          <CountUp end={total} decimals={Number.isInteger(total) ? 0 : 2} suffix={` ${currency}`} />
        </div>
      </div>
    </Card>
  );
}
