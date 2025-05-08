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

  const stats = await getCategoriesStats(
    user.id,
    parsedBody.data.from,
    parsedBody.data.to
  );
  return Response.json(stats);
}

async function getCategoriesStats(id: string, from: Date, to: Date) {
  const stats = await prisma.transaction.groupBy({
    by: ["type", "category", "categoryIcon"],
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
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });

  return stats;
}

export type Categoriestype = Awaited<ReturnType<typeof getCategoriesStats>>;
