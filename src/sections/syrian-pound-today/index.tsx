import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import SYPTodayCard from "@/components/card/syp-today-card";

export type CurrencyToday = {
  code: string;
  buy: number;
  sell: number;
  change: number;
}

export interface ServerResponse {
  [key: string]: CurrencyToday;
}

export default async function SyrianPoundToday() {
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const userData = await prisma.user.findUnique({ where: { userId: user.id } });
  if (!userData) redirect(routes.currency);

  const response = await fetch(
    process.env.NEXT_PUBLIC_SYRIAN_POUND_TODAY!, {
    headers: {
      accept: 'application/json',
      'User-agent': 'learning app',
    }
  }).then(res => res.json()).catch((error) => console.error('Error in SYRIAN POUND TODAY Page', error));
  const res: ServerResponse = response?.data?.currencies || []
  const currencies: CurrencyToday[] = Object.entries(res)
    .filter(([key]) => key.endsWith(":damascus"))
    .map(([key, value]) => {
      return {
        code: key.split(":")[0],
        buy: value?.buy,
        sell: value?.sell,
        change: value?.change
      };
    });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
      {currencies && Array.isArray(currencies) &&
        currencies.map((currencyToday) => <SYPTodayCard key={currencyToday.code} currencyToday={currencyToday} />)}
    </div>
  );
}
