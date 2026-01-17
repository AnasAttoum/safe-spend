import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import SYPTodayCard from "@/components/card/syp-today-card";
import { Time } from "@/components/time";

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
  const currencies: currencyToday[] = response?.data?.currencies || []

  return (
    <>
      {response?.data?.updated_at && <div className="py-3">
        <h3 className="text-lg md:text-3xl">Last Update: &nbsp;
          <span className="text-safeSpend-light font-bold">
            <Time iso={response.data.updated_at} />
          </span>
        </h3>
      </div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        {currencies && Array.isArray(currencies) &&
          currencies.map((currencyToday) => <SYPTodayCard key={currencyToday.slug} currencyToday={currencyToday} />)}
      </div>
    </>
  );
}
