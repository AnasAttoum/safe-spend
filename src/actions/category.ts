"use server";

import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import {
  createCategorySchema,
  CreateCategorySchemaType,
  deleteSchema,
  deleteSchemaType,
} from "@/schema/category";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { deleteTransaction } from "./transaction";

export async function createCategory(form: CreateCategorySchemaType) {
  const parsedBody = createCategorySchema.safeParse(form);
  if (!parsedBody.success) return { error: "Bad request!" };

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
    return { error: "This name is already taken!" };
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
  const parsedBody = deleteSchema.safeParse(form);
  if (!parsedBody.success) return { error: "Bad request!" };

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
    transactionsToDelete.map(({ id }) => deleteTransaction(id))
  );

  return await prisma.category.delete({
    where: {
      userId: user.id,
      id,
    },
  });
}

export async function getCategory(form: deleteSchemaType) {
  const parsedBody = deleteSchema.safeParse(form);
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
