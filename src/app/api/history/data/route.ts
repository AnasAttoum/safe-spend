import { routes } from "@/config/routes";
import { getHistory } from "@/lib/get-history";
import { Period, Timeframe } from "@/lib/types";
import { getHistoryDataSchema } from "@/schema/history";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get("timeframe");
  const year = searchParams.get("year");
  const month = searchParams.get("month");
  const currency = searchParams.get("currency") || "";

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
      return await getHistory(
        userId,
        currency,
        period.year,
        period.month
      );
    case "year":
      return await getHistory(userId, currency, period.year);
  }
};