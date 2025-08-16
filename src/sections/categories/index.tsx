import { currentUser } from "@clerk/nextjs/server";
import CategoryList from "./views/category-list";
import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";

export default async function Categories() {
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const userData = await prisma.user.findUnique({ where: { userId: user.id } });
  if (!userData) redirect(routes.currency);

  return (
    <>
      <div className="py-3">
        <h3 className="text-3xl">Categories</h3>
      </div>

      <div className="flex flex-col gap-3 mt-3">
        <CategoryList type="income" />
        <CategoryList type="expense" />
      </div>
    </>
  );
}
