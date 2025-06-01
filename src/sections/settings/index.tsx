import { currentUser } from "@clerk/nextjs/server";
import CategoryList from "./views/category-list";
import Currency from "./views/currency";
import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";

export default async function Settings() {
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const userData = await prisma.user.findUnique({ where: { userId: user.id } });
  if (!userData) redirect(routes.currency);

  return (
    <>
      <div className="py-3">
        <h3 className="text-3xl">Settings</h3>
        <p className="text-sm text-gray-500">
          Manage your account settings and categories
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-3">
        <Currency />
        <CategoryList type="income" />
        <CategoryList type="expense" />
      </div>
    </>
  );
}
