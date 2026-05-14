import { routes } from "@/config/routes";
import { getHistory } from "@/lib/get-history";
import { Period, Timeframe } from "@/lib/types";
import { getHistoryDataSchema } from "@/schema/history";
import { currentUser } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const t = await getTranslations("errors");
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get("timeframe");
  const year = searchParams.get("year");
  const month = searchParams.get("month");
  const currency = searchParams.get("currency") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const hasCategoryId =
    categoryId &&
    categoryId !== "" &&
    categoryId !== "undefined" &&
    categoryId !== "null";

  const parsedBody = getHistoryDataSchema(t).safeParse({
    timeframe,
    year,
    month,
    currency,
    ...(hasCategoryId && { categoryId }),
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
    currency,
    parsedBody.data.categoryId,
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
  currency: string,
  categoryId: string | null | undefined = undefined,
) => {
  switch (timeframe) {
    case "month":
      return await getHistory(
        userId,
        currency,
        period.year,
        period.month,
        categoryId,
      );
    case "year":
      return await getHistory(
        userId,
        currency,
        period.year,
        undefined,
        categoryId,
      );
  }
};
