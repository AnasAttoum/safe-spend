import { prisma } from "./prisma";

export async function getBalanceStats(id: string, from: Date | undefined, to: Date) {
  const totalTransactions = await prisma.transaction.groupBy({
    by: ["type", "currency"],
    where: {
      userId: id,
      date: {
        ...(from ? { gte: from } : {}),
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const totalExchanges = await prisma.exchange.groupBy({
    by: ["exchangeCurrency", "targetCurrency"],
    where: {
      userId: id,
      date: {
        ...(from ? { gte: from } : {}),
        lte: to,
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

    stats[exchangeCurrency].expense += _sum.exchangeAmount || 0;
    stats[targetCurrency].income += _sum.collectedAmount || 0;
  }

  return Object.values(stats);
}