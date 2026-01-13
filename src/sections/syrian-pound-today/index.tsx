import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import SYPTodayCard from "@/components/card/syp-today-card";
import { formatDate } from "date-fns";

export type currencyToday = {
  slug: string;
  name_ar: string;
  flag: string;
  cities: {
    damascus: {
      buy: number;
      sell: number;
      change: number;
    }
  }
}

export default async function SyrianPoundToday() {
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const userData = await prisma.user.findUnique({ where: { userId: user.id } });
  if (!userData) redirect(routes.currency);

  if (userData.currency !== 'SYP')
    redirect(routes.dashboard);

  const response = await fetch(
    process.env.NEXT_PUBLIC_SYRIAN_POUND_TODAY!, {
    headers: {
      accept: 'application/json',
      'User-agent': 'learning app',
    }
  }).then(res => res.json()).catch((error) => console.error('Error in SYRIAN POUND TODAY Page', error));
  const rates: currencyToday[] = response?.data?.rates || []

  return (
    <>
      {response?.data?.currencies_updated_at && <div className="py-3">
        <h3 className="text-3xl">Last Update: <span className="text-safeSpend-light font-bold">{formatDate(response?.data?.currencies_updated_at, "d.M.yyyy - h:mm a")}</span></h3>
      </div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        {rates && Array.isArray(rates) &&
          rates.map((currencyToday) => <SYPTodayCard key={currencyToday.slug} currencyToday={currencyToday} />)}
      </div>
    </>
  );
}
