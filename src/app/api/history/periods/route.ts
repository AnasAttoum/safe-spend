import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET() {
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const periods = await getHistoryPeriods(user.id);
  return Response.json(periods);
}

export type getHistoryPeriodsType = Awaited<
  ReturnType<typeof getHistoryPeriods>
>;

const getYears = (dates: Date[]) =>
  Array.from(new Set(dates.map((d) => d.getFullYear()))).sort((a, b) => a - b);

const getHistoryPeriods = async (userId: string) => {
  const [firstTransaction, firstExchange, allTransactions, allExchanges] =
    await Promise.all([
      // Get earliest transaction
      prisma.transaction.aggregate({
        where: { userId },
        _min: { date: true },
      }),
      // Get earliest exchange
      prisma.exchange.aggregate({
        where: { userId },
        _min: { date: true },
      }),
      // Get all transaction dates
      prisma.transaction.findMany({
        where: { userId },
        select: { date: true },
      }),
      // Get all exchange dates
      prisma.exchange.findMany({
        where: { userId },
        select: { date: true },
      }),
    ]);

  const allDates = [
    ...allTransactions.map((t) => t.date),
    ...allExchanges.map((e) => e.date),
    new Date(),
  ];
  
  return {
    // Extract earliest date
    firstDate:
      [firstTransaction._min.date, firstExchange._min.date]
        .filter((d): d is Date => d !== null)
        .sort((a, b) => a.getTime() - b.getTime())?.[0] || new Date(),
    // Return all years
    allYears: !allDates.length
      ? [new Date().getFullYear()]
      : getYears(allDates),
  };
};
