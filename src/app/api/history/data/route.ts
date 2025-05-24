import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import { HistoryData, Period, Timeframe } from "@/lib/types";
import { getHistoryDataSchema } from "@/schema/history";
import { currentUser } from "@clerk/nextjs/server";
import { getDaysInMonth } from "date-fns";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get("timeframe");
  const year = searchParams.get("year");
  const month = searchParams.get("month");
  const currency = searchParams.get("currency") || '';

  const parsedBody = getHistoryDataSchema.safeParse({
    timeframe,
    year,
    month,
    currency,
  });
  if (!parsedBody.success)
    return Response.json(parsedBody.error.message, { status: 400 });

  const periods = await getHistoryData(
    user.id,
    parsedBody.data.timeframe,
    {
      month: parsedBody.data.month,
      year: parsedBody.data.year,
    },
    currency
  );
  return Response.json(periods);
}

export type getHistoryDataResponseType = Awaited<
  ReturnType<typeof getHistoryData>
>;

const getHistoryData = async (
  userId: string,
  timeframe: Timeframe,
  period: Period,
  currency: string
) => {
  switch (timeframe) {
    case "month":
      return await getMonthHistoryData(
        userId,
        period.year,
        period.month,
        currency
      );
    case "year":
      return await getYearHistoryData(userId, period.year, currency);
  }
};

const getMonthHistoryData = async (
  userId: string,
  year: number,
  month: number,
  currency: string
) => {
  const result = await prisma.monthTable.groupBy({
    by: ["day"],
    where: { userId, year, month, currency },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: [
      {
        day: "asc",
      },
    ],
  });
  if (!result || result.length === 0) return [];

  const history: HistoryData[] = [];
  const daysInMonth = getDaysInMonth(new Date(year, month));

  for (let i = 1; i < daysInMonth; i++) {
    let income = 0,
      expense = 0;
    const day = result.find((row) => row.day === i);
    if (day) {
      income = day._sum.income || 0;
      expense = day._sum.expense || 0;
    }
    history.push({
      day: i,
      month,
      year,
      income,
      expense,
    });
  }

  return history;
};

const getYearHistoryData = async (
  userId: string,
  year: number,
  currency: string
) => {
  const result = await prisma.yearTable.groupBy({
    by: ["month"],
    where: { userId, year, currency },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: [
      {
        month: "asc",
      },
    ],
  });
  if (!result || result.length === 0) return [];

  const history: HistoryData[] = [];
  for (let i = 0; i < 12; i++) {
    let income = 0,
      expense = 0;
    const month = result.find((row) => row.month === i);
    if (month) {
      income = month._sum.income || 0;
      expense = month._sum.expense || 0;
    }
    history.push({
      month: i,
      year,
      income,
      expense,
    });
  }

  return history;
};
