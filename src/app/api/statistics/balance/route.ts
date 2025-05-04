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
  const totals = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      userId: id,
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
  });

  return {
    income: totals.find(el=>el.type==='income')?._sum.amount || 0,
    expense: totals.find(el=>el.type==='expense')?._sum.amount || 0,
  }
}

export type Balancetype = Awaited<ReturnType<typeof getBalanceStats>>;
