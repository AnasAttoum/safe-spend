"use server";

import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import {
  createCategorySchema,
  CreateCategorySchemaType,
  deleteSchema,
  deleteSchemaType,
  updateCategorySchema,
  updateCategoryType,
} from "@/schema/category";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { deleteTransaction } from "./transaction";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";

export async function createCategory(form: CreateCategorySchemaType) {
  const t = await getTranslations("errors");
  const parsedBody = createCategorySchema(t).safeParse(form);
  if (!parsedBody.success) return { error: t("bad-request") };

  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const { name, type, icon } = parsedBody.data;

  const category = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name,
      type,
    },
  });
  if (category) {
    return { error: t("name-already-taken") };
    // throw new Error('This name already taken!')
  }

  const cat = await prisma.category.create({
    data: {
      userId: user.id,
      name,
      type,
      icon,
    },
  });
  return { data: cat };
}

export async function deleteCategory(form: deleteSchemaType) {
  const t = await getTranslations("errors");
  const parsedBody = deleteSchema(t).safeParse(form);
  if (!parsedBody.success) return { error: t("bad-request") };

  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const id = parsedBody.data;

  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      id,
    },
  });

  const transactionsToDelete = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      categoryId: categoryRow?.id,
    },
    select: {
      id: true,
    },
  });

  await Promise.all(
    transactionsToDelete.map(({ id }) => deleteTransaction(id)),
  );

  return await prisma.category.delete({
    where: {
      userId: user.id,
      id,
    },
  });
}

export async function getCategory(form: deleteSchemaType) {
  const t = await getTranslations("errors");
  const parsedBody = deleteSchema(t).safeParse(form);
  if (!parsedBody.success) return null;

  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const id = parsedBody.data;

  const category = await prisma.category.findFirst({
    where: {
      userId: user.id,
      id,
    },
  });

  let transactionsCount = 0;
  if (category) {
    const count = await prisma.transaction.aggregate({
      where: {
        userId: user.id,
        categoryId: id,
      },
      _count: { _all: true },
    });
    transactionsCount = count._count._all;
  }

  return category ? { category, transactionsCount } : null;
}

export async function getCategories() {
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const categories = await prisma.category.findMany({
    where: {
      userId: user.id,
    },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
  });

  return {
    income: categories.filter(({ type }) => type === "income"),
    expense: categories.filter(({ type }) => type === "expense"),
  };
}
export type TypedCategoriesType = Awaited<ReturnType<typeof getCategories>>;

export async function updateCategory(form: updateCategoryType) {
  const t = await getTranslations("errors");
  const parsedBody = updateCategorySchema(t).safeParse(form);
  if (!parsedBody.success) return { error: t("bad-request") };

  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const { id, name, type, icon } = parsedBody.data;

  const category = await prisma.category.findFirst({
    where: {
      userId: user.id,
      id,
    },
  });
  if (!category) {
    return { error: t("category-not-found") };
  }

  const cat = await prisma.category.update({
    where: {
      userId: user.id,
      id,
    },
    data: {
      userId: user.id,
      name,
      type,
      icon,
    },
  });

  revalidatePath("/");
  return { data: cat };
}
