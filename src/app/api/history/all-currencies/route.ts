import { routes } from "@/config/routes";
import { getBalanceStats } from "@/lib/get-balance-stats";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { lastDayOfMonth } from "date-fns";
import { redirect } from "next/navigation";

export async function GET() {
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const periods = await getHistoryData(user.id);

  return Response.json(periods);
}

export type getHistoryAllCurrenciesResponseType = Awaited<
  ReturnType<typeof getHistoryData>
>;

const getHistoryData = async (userId: string) => {
  const result = await prisma.yearTable.groupBy({
    by: ["month", "year", "currency"],
    where: { userId },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: [
      {
        month: "desc",
      },
    ],
  });
  if (!result || result.length === 0)
    return { uniqeCurrencies: [], allCurrenciesBalance: [] };

  const years = new Set<number>();
  const currencies = new Set<string>();
  result.forEach((el) => {
    years.add(el.year);
    currencies.add(el.currency);
  });
  const uniqeYears: number[] = Array.from(years);
  const uniqeCurrencies: string[] = Array.from(currencies);

  const allCurrenciesBalance: Record<string, number>[] = [];
  await Promise.all(
    uniqeYears.map(async (year) => {
      await Promise.all(
        Array.from({ length: 12 }, async (_, month) => {
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          if (year === currentYear && month > currentMonth) return;

          const endOfMonth = lastDayOfMonth(new Date(year, month));
          const balanceOfThisMonth = await getBalanceStats(
            userId,
            undefined,
            endOfMonth
          );

          const stepData: Record<string, number> = {};
          uniqeCurrencies.forEach((curr) => {
            const found = balanceOfThisMonth.find(
              ({ currency }) => currency === curr
            ) || { income: 0, expense: 0 };
            stepData[curr] = found.income - found.expense;
          });

          allCurrenciesBalance.push({ year, month, ...stepData });
        })
      );
    })
  );

  return {
    uniqeCurrencies,
    allCurrenciesBalance: allCurrenciesBalance.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    }),
  };
};
