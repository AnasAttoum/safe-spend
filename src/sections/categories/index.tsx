import { currentUser } from "@clerk/nextjs/server";
import CategoryList from "./views/category-list";
import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import { getCategories } from "@/actions/category";
import { getTranslations } from "next-intl/server";

export default async function Categories() {
  const t = await getTranslations("category");
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const userData = await prisma.user.findUnique({ where: { userId: user.id } });
  if (!userData) redirect(routes.currency);

  const categories = await getCategories()

  return (
    <>
      <div className="py-3">
        <h3 className="text-3xl">{t("categories")}</h3>
      </div>

      <div className="flex flex-col gap-3 mt-3">
        <CategoryList type="income" data={categories.income} />
        <CategoryList type="expense" data={categories.expense} />
      </div>
    </>
  );
}
