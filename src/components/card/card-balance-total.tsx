import React from "react";
import { Card } from "../ui/card";
import CountUp from "react-countup";
import Logo from "../logo";

type Props = {
  balance: { currency: string; total: number }
};

export default function CardBalanceTotal({ balance }: Props) {

  const { currency = '', total = 0 } = balance

  return (
    <Card className="bg-blue-secondary overflow-hidden border border-blue-primary">
      <div className="flex items-center gap-3 px-5 relative">
        <Logo size={150} className="absolute right-0 opacity-20" />
        <div className="flex flex-wrap justify-center w-full text-2xl md:text-3xl text-white font-bold gap-2">
          <CountUp end={total} />
          {currency}
        </div>
      </div>
    </Card>
  );
}
