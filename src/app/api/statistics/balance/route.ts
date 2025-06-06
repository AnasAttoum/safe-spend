import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import { overviewSchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const parsedBody = overviewSchema.safeParse({ from, to });
  if (!parsedBody.success)
    return Response.json(parsedBody.error.message, { status: 400 });

  const stats = await getBalanceStats(
    user.id,
    parsedBody.data.from,
    parsedBody.data.to
  );
  return Response.json(stats);
}

async function getBalanceStats(id: string, from: Date, to: Date) {
  const totalTransactions = await prisma.transaction.groupBy({
    by: ["type", "currency"],
    where: {
      userId: id,
      date: {
        gte: new Date(format(from, "yyyy-MM-dd 00:00:00")),
        lte: new Date(format(to, "yyyy-MM-dd 00:00:00")),
      },
    },
    _sum: {
      amount: true,
    },
  });

  console.log(
    "🚀 ~ getBalanceStats ~ totalTransactions:",
    from,
    format(from, "yyyy-MM-dd 00:00:00"),
    totalTransactions
  );

  const totalExchanges = await prisma.exchange.groupBy({
    by: ["exchangeCurrency", "targetCurrency"],
    where: {
      userId: id,
      date: {
        gte: new Date(format(from, "yyyy-MM-dd 00:00:00")),
        lte: new Date(format(to, "yyyy-MM-dd 00:00:00")),
      },
    },
    _sum: {
      exchangeAmount: true,
      collectedAmount: true,
    },
  });

  const stats: Record<
    string,
    { currency: string; income: number; expense: number }
  > = {};

  for (const item of totalTransactions) {
    const { currency, type, _sum } = item;
    if (!stats[currency]) {
      stats[currency] = { currency, income: 0, expense: 0 };
    }

    if (type === "income") {
      stats[currency].income = _sum.amount || 0;
    } else if (type === "expense") {
      stats[currency].expense = _sum.amount || 0;
    }
  }

  for (const item of totalExchanges) {
    const { exchangeCurrency, targetCurrency, _sum } = item;
    if (!stats[exchangeCurrency]) {
      stats[exchangeCurrency] = {
        currency: exchangeCurrency,
        income: 0,
        expense: 0,
      };
    }
    if (!stats[targetCurrency]) {
      stats[targetCurrency] = {
        currency: targetCurrency,
        income: 0,
        expense: 0,
      };
    }

    stats[exchangeCurrency].expense = _sum.exchangeAmount || 0;
    stats[targetCurrency].income = _sum.collectedAmount || 0;
  }

  return Object.values(stats);
}

export type Balancetype = Awaited<ReturnType<typeof getBalanceStats>>;
