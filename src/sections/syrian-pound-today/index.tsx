import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import SYPTodayCard from "@/components/card/syp-today-card";

export type currencyToday = {
  name: string;
  ar_name: string;
  ask: string; //Buy
  bid: string; //Sell
  arrow: "0" | "1";
  icon: string;
  change: string;
  change_percentage: string;
}

export default async function SyrianPoundToday() {
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const userData = await prisma.user.findUnique({ where: { userId: user.id } });
  if (!userData) redirect(routes.currency);

  if (userData.currency !== 'SYP')
    redirect(routes.dashboard);

  const data:currencyToday = userData.currency === 'SYP'
    ? await fetch(process.env.NEXT_PUBLIC_SYRIAN_POUND_TODAY ?? '').then(res => res.json()).catch((error) => console.error('Error in SYRIAN_POND_TODAY', error))
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
      {data && Array.isArray(data) &&
        data.map((currencyToday) => <SYPTodayCard key={data.name} currencyToday={currencyToday} />)}
    </div>
  );
}
