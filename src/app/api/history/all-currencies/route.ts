import { currentUser } from "@/actions/user";
import { routes } from "@/config/routes";
import { getHistoryData } from "@/lib/get-history";
import { redirect } from "next/navigation";

export async function GET() {
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const periods = await getHistoryData(user.id);

  return Response.json(periods);
}

export type getHistoryAllCurrenciesResponseType = Awaited<
  ReturnType<typeof getHistoryData>
>;
