import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import { Time } from "@/components/time";
import GoldTodayCard from "@/components/card/gold-today-card";
import { Card } from "@/components/ui/card";
import Count from "@/components/count-up";

export type karatToday = {
  karat: string;
  price_per_gram: number;
  price_per_ounce: number;
  change: number;
}

export type goldSYPToday = Record<string, {
  buy: number;
  sell: number;
  change: number;
}>;

export default async function GoldToday() {
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const userData = await prisma.user.findUnique({ where: { userId: user.id } });
  if (!userData) redirect(routes.currency);

  const response = await fetch(
    process.env.NEXT_PUBLIC_gold!, {
    headers: {
      accept: 'application/json',
      'User-agent': 'learning app',
    }
  }).then(res => res.json()).catch((error) => console.error('Error in GOLD TODAY Page', error));
  const karats: karatToday[] = response?.data?.karats || []
  const ounce = response?.data?.spot_price;

  const responseSYP = await fetch(
    process.env.NEXT_PUBLIC_gold_SYP!, {
    headers: {
      accept: 'application/json',
      'User-agent': 'learning app',
    }
  }).then(res => res.json()).catch((error) => console.error('Error in GOLD TODAY Page', error));
  const goldSYP: goldSYPToday = responseSYP?.data?.gold

  return (
    <>
      {response?.data?.updated_at && <div className="py-3">
        <h3 className="text-2xl md:text-3xl">Updated At:&nbsp;
          <span className="text-gold font-bold">
            <Time iso={response.data.updated_at} />
          </span>
        </h3>
      </div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        <Card className="sm:text-2xl font-bold flex flex-col justify-evenly transition-all duration-300 hover:scale-101 hover:-translate-y-1 p-5 bg-linear-to-b from-gold to-gold/80">
          <div className="text-center">OUNCE</div>
          <div className="flex flex-row justify-between items-center">
            <div><Count num={ounce.price_usd} suffix=" $" /></div>

            <div>{ounce.change !== 0 ?
              <span
                className="rounded-2xl px-2 text-white"
              >{ounce.change > 0 && '+'}{ounce.change.toFixed(2)}%</span>
              : <span></span>
            }</div>
          </div>
        </Card>
        {karats && Array.isArray(karats) &&
          karats.map((karatToday) => <GoldTodayCard key={karatToday.karat} karatToday={karatToday} goldSYP={goldSYP} />)}
      </div>
    </>
  );
}
