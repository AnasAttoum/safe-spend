import { currentUser } from "@/actions/user";
import { routes } from "@/config/routes";
import CurrencyView from "@/sections/currency";
import { redirect } from "next/navigation";

export default async function page() {
  const user = await currentUser();

  if (!user) {
    redirect(routes.signIn);
  }
  return <CurrencyView firstName={user.firstName || ""} />;
}
