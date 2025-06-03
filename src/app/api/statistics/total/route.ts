import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

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

  const result = total.map(({ currency, _sum }) => ({
    currency,
    total: (_sum.income || 0) - (_sum.expense || 0),
  }));

  return Response.json(result);
}