import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET() {
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const periods = await getHistoryPeriods(user.id);
  return Response.json(periods);
}

export type getHistoryPeriodsType = Awaited<
  ReturnType<typeof getHistoryPeriods>
>;

const getHistoryPeriods = async (userId: string) => {
  const result = await prisma.monthTable.findMany({
    where: {
      userId,
    },
    select: {
      year: true,
    },
    distinct: ["year"],
    orderBy: [{ year: "asc" }],
  });

  const years = result.map((el) => el.year);

  if (years.length === 0) return [new Date().getFullYear()];
  return years;
};
