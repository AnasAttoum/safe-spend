import { getDaysInMonth } from "date-fns";
import { prisma } from "./prisma";
import { HistoryData } from "./types";
import { getBalanceStats } from "./get-balance-stats";

export async function getHistory(
  userId: string,
  currency: string | undefined = undefined,
  year: number | undefined = undefined,
  month: number | undefined = undefined,
  categoryId: string | null | undefined = undefined
) {
  const hasCategoryId =
    categoryId &&
    categoryId !== "" &&
    categoryId !== "undefined" &&
    categoryId !== "null";

  const monthHistory = year && month !== undefined;
  const start = monthHistory
    ? new Date(Date.UTC(year, month, 1))
    : new Date(Date.UTC(year ?? 2000, 0, 1)); // ex: 2025-01-01T00:00:00.000Z
  const end = monthHistory
    ? new Date(Date.UTC(year, month + 1, 1))
    : new Date(Date.UTC((year ?? 2000) + 1, 0, 1));

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      ...(currency && { currency }),
      ...(year && {
        date: {
          gte: start,
          lt: end,
        },
      }),
      ...(hasCategoryId && { categoryId }),
    },
    select: { amount: true, type: true, date: true, currency: true },
  });

  const where: any = {
    userId,
    ...(year && {
      date: {
        gte: start,
        lt: end,
      },
    }),
  };

  if (currency) {
    where.OR = [{ exchangeCurrency: currency }, { targetCurrency: currency }];
  }
  const exchanges = await prisma.exchange.findMany({
    where,
    select: {
      exchangeAmount: true,
      exchangeCurrency: true,
      collectedAmount: true,
      targetCurrency: true,
      date: true,
    },
  });

  const groupedTransactions = transactions.reduce((acc, t) => {
    const monthInDate = t.date.getUTCMonth(); // getMonth() gives 0-11
    const dayInDate = t.date.getUTCDate() - 1; // getDate() gives 1 to 31
    const yeaInDate = t.date.getFullYear();

    if (monthHistory) {
      const index = monthInDate.toString() + dayInDate.toString() + t.currency;

      if (!acc[index])
        acc[index] = {
          year: yeaInDate,
          month: monthInDate,
          day: dayInDate,
          income: 0,
          expense: 0,
          currency: t.currency,
        };
      if (t.type === "income") acc[index].income += t.amount;
      else acc[index].expense += t.amount;
    } else {
      const index = monthInDate.toString() + t.currency;

      if (!acc[index])
        acc[index] = {
          year: yeaInDate,
          month: monthInDate,
          income: 0,
          expense: 0,
          currency: t.currency,
        };
      if (t.type === "income") acc[index].income += t.amount;
      else acc[index].expense += t.amount;
    }

    return acc;
  }, {} as Record<string, { year: number; month: number; day?: number; income: number; expense: number; currency: string }>);
  const finalTransactions = Object.values(groupedTransactions).sort(
    (a, b) => a.month - b.month
  );

  const groupedExchanges = exchanges.reduce((acc, e) => {
    const monthInDate = e.date.getUTCMonth(); // getMonth() gives 0-11
    const dayInDate = e.date.getUTCDate() - 1; // getDate() gives 1 to 31
    const yeaInDate = e.date.getFullYear();

    if (monthHistory) {
      const index = currency
        ? monthInDate.toString() + dayInDate.toString() + currency
        : "ERROR";

      const indexExchangeCurrency = currency
        ? "ERROR"
        : monthInDate.toString() + dayInDate.toString() + e.exchangeCurrency;
      const indexTargetCurrency = currency
        ? "ERROR"
        : monthInDate.toString() + dayInDate.toString() + e.targetCurrency;

      if (currency) {
        if (!acc[index])
          acc[index] = {
            year: yeaInDate,
            month: monthInDate,
            day: dayInDate,
            income: 0,
            expense: 0,
            currency,
          };
        if (e.targetCurrency === currency)
          acc[index].income += e.collectedAmount;
        if (e.exchangeCurrency === currency)
          acc[index].expense += e.exchangeAmount;
      } else {
        if (!acc[indexExchangeCurrency])
          acc[indexExchangeCurrency] = {
            year: yeaInDate,
            month: monthInDate,
            day: dayInDate,
            income: 0,
            expense: 0,
            currency: e.exchangeCurrency,
          };
        if (!acc[indexTargetCurrency])
          acc[indexTargetCurrency] = {
            year: yeaInDate,
            month: monthInDate,
            day: dayInDate,
            income: 0,
            expense: 0,
            currency: e.targetCurrency,
          };
        acc[indexTargetCurrency].income += e.collectedAmount;
        acc[indexExchangeCurrency].expense += e.exchangeAmount;
      }
    } else {
      const index = currency ? monthInDate.toString() + currency : "ERROR";

      const indexExchangeCurrency = currency
        ? "ERROR"
        : monthInDate.toString() + e.exchangeCurrency;
      const indexTargetCurrency = currency
        ? "ERROR"
        : monthInDate.toString() + e.targetCurrency;

      if (currency) {
        if (!acc[index])
          acc[index] = {
            year: yeaInDate,
            month: monthInDate,
            income: 0,
            expense: 0,
            currency,
          };
        if (e.targetCurrency === currency)
          acc[index].income += e.collectedAmount;
        if (e.exchangeCurrency === currency)
          acc[index].expense += e.exchangeAmount;
      } else {
        if (!acc[indexExchangeCurrency])
          acc[indexExchangeCurrency] = {
            year: yeaInDate,
            month: monthInDate,
            income: 0,
            expense: 0,
            currency: e.exchangeCurrency,
          };
        if (!acc[indexTargetCurrency])
          acc[indexTargetCurrency] = {
            year: yeaInDate,
            month: monthInDate,
            income: 0,
            expense: 0,
            currency: e.targetCurrency,
          };
        acc[indexTargetCurrency].income += e.collectedAmount;
        acc[indexExchangeCurrency].expense += e.exchangeAmount;
      }
    }

    return acc;
  }, {} as Record<string, { year: number; month: number; day?: number; income: number; expense: number; currency: string }>);
  const finalExchanges = hasCategoryId
    ? []
    : Object.values(groupedExchanges).sort((a, b) => a.month - b.month);

  const years = new Set<number>();
  const currencies = new Set<string>();
  finalTransactions.forEach((el) => {
    years.add(el.year);
    currencies.add(el.currency);
  });
  finalExchanges.forEach((el) => {
    years.add(el.year);
    currencies.add(el.currency);
  });
  const uniqeYears: number[] = Array.from(years);
  const uniqeCurrencies: string[] = Array.from(currencies);
  const daysInMonth = getDaysInMonth(new Date(year ?? 2000, month ?? 0));
  const history: HistoryData[] = [];
  for (let i = 0; i < (monthHistory ? daysInMonth : 12); i++) {
    const monthTransaction = finalTransactions.filter((row) =>
      monthHistory ? row.day === i : row.month === i
    );

    const monthExchange = finalExchanges.filter((row) =>
      monthHistory ? row.day === i : row.month === i
    );

    if (!!monthExchange.length) {
      monthExchange.forEach((exchange) => {
        const found = monthTransaction.find(
          ({ currency }) => currency === exchange.currency
        );

        if (found) {
          found.income = (found.income || 0) + (exchange.income || 0);
          found.expense = (found.expense || 0) + (exchange.expense || 0);
        } else monthTransaction.push(exchange);
      });
    }

    history.push(...monthTransaction);
  }

  if (history.every((el) => el.income === 0 && el.expense === 0)) return [];

  const completeEmptyMissingData = monthHistory
    ? Array.from({ length: daysInMonth }, (_, i) => {
        const day = i;
        const existing = history.find(
          (h) => h.year === year && h.month === month && h.day === day
        );

        return (
          existing || {
            year,
            month,
            day,
            income: 0,
            expense: 0,
            currency: currency ?? "CURRENCYNOTFOUND",
          }
        );
      })
    : uniqeYears.flatMap((year) =>
        Array.from({ length: 12 }, (_, idx) => idx).flatMap((month) =>
          uniqeCurrencies.map((currency) => {
            // Try to find a matching transaction
            const existing = history.find(
              (h) =>
                h.year === year && h.month === month && h.currency === currency
            );

            return (
              existing || {
                year,
                month,
                income: 0,
                expense: 0,
                currency,
              }
            );
          })
        )
      );
  return completeEmptyMissingData;
}

export const getHistoryData = async (userId: string) => {
  const result = (await getHistory(userId)) || [];
  if (!result || result.length === 0)
    return { uniqeCurrencies: [], allCurrenciesBalance: [] };

  const years = new Set<number>();
  const currencies = new Set<string>();

  const date = new Date();
  const thisYear = date.getUTCFullYear();
  years.add(thisYear);

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

          const endOfMonth = new Date(
            Date.UTC(year, month + 1, 0, 23, 59, 59, 999)
          );
          // const endOfMonth = lastDayOfMonth(new Date(year, month));
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
