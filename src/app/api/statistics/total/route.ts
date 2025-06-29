import { defaultCurrency } from "@/config/currencies";
import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { startOfMonth } from "date-fns";
import { getBalanceStats } from "@/lib/get-balance-stats";

export async function GET() {
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const total = await prisma.yearTable.groupBy({
    by: ["currency"],
    where: {
      userId: user.id,
    },
    _sum: {
      income: true,
      expense: true,
    },
  });

  const result = total
    .map(({ currency, _sum }) => ({
      currency,
      total: (_sum.income || 0) - (_sum.expense || 0),
    }))
    .filter((el) => el.total !== 0);

  if (!result.length) {
    const userRow = await prisma.user.findFirst({
      where: { userId: user.id },
    });
    return Response.json([
      { currency: userRow?.currency || defaultCurrency.value, total: 0 },
    ]);
  }

  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const diffThisMonth = await getBalanceStats(user.id, currentMonthStart, now);
  const resultWithDiffThisMonth = result.map((res) => {
    const diff = diffThisMonth.find(
      ({ currency }) => res.currency === currency
    );
    return { ...res, diff: (diff?.income || 0) - (diff?.expense || 0) };
  });

  return Response.json(resultWithDiffThisMonth);
}
