import { routes } from "@/config/routes";
import { getBalanceStats } from "@/lib/get-balance-stats";
import { overviewSchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const categoryId = searchParams.get("categoryId");

  const parsedBody = overviewSchema.safeParse({ from, to, categoryId });

  if (!parsedBody.success)
    return Response.json(parsedBody.error.message, { status: 400 });

  const stats = await getBalanceStats(
    user.id,
    parsedBody.data.from,
    parsedBody.data.to,
    categoryId
  );
  return Response.json(stats);
}

export type Balancetype = Awaited<ReturnType<typeof getBalanceStats>>;
