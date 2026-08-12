import { routes } from "@/config/routes";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getHistoryData } from "@/lib/get-history";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");

  const userData = await prisma.user.findUnique({ where: { userId: user.id } });
  if (!userData) redirect(routes.currency);

  const { allCurrenciesBalance } = await getHistoryData(user.id, categoryId);

  if (!allCurrenciesBalance.length)
    return Response.json({
      currency: userData.currency,
      total: 0,
      diff: 0,
    });

  const date = new Date();
  const thisYear = date.getUTCFullYear();
  const thisMonth = date.getUTCMonth();

  // Calculate last month/year
  const lastMonthDate = new Date(Date.UTC(thisYear, thisMonth - 1, 1));
  const lastMonth = lastMonthDate.getUTCMonth();
  const lastMonthYear = lastMonthDate.getUTCFullYear();

  const lastIndex = allCurrenciesBalance.length - 1;
  const lastBalance = allCurrenciesBalance[lastIndex];

  const allCurrencies = Object.keys(lastBalance).filter(
    (key) => key !== "year" && key !== "month"
  );

  const defaultBalance = {
    year: lastBalance.year,
    month: lastBalance.month,
    ...Object.fromEntries(allCurrencies.map((key) => [key, 0])),
  };
  const balanceThisMonth: Record<string, number> =
    allCurrenciesBalance.find(
      (bal) => bal.year === thisYear && bal.month === thisMonth
    ) || defaultBalance;

  const balanceLastMonth: Record<string, number> =
    allCurrenciesBalance.find(
      (bal) => bal.year === lastMonthYear && bal.month === lastMonth
    ) || defaultBalance;

  const resultWithDiffThisMonth = allCurrencies.map((currency) => {
    return {
      currency,
      total: lastBalance[currency] || 0,
      diff:
        (balanceThisMonth[currency] || 0) - (balanceLastMonth[currency] || 0),
    };
  });

  return Response.json(resultWithDiffThisMonth);
}
