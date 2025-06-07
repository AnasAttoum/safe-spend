import { routes } from "@/config/routes";

import { prisma } from "@/lib/prisma";
import { overviewSchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const parsedBody = overviewSchema.safeParse({
    from,
    to,
  });
  if (!parsedBody.success)
    return Response.json(parsedBody.error.message, { status: 400 });

  const transactions = await getHistoryData(
    user.id,
    parsedBody.data.from,
    parsedBody.data.to
  );
  return Response.json(transactions);
}

export type getTransactionsHistoryDataResponseType = Awaited<
  ReturnType<typeof getHistoryData>
>;

const getHistoryData = async (userId: string, from: Date, to: Date) =>
  await prisma.transaction.findMany({
    where: {
      userId: userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      date: "desc",
    },
    include: {
      Category: {
        select: {
          name: true,
          icon: true,
        },
      },
    },
  });
