"use server";

import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import {
  createTransactionSchema,
  createTransactionType,
} from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function createTransaction(form: createTransactionType) {
  const parsedBody = createTransactionSchema.safeParse(form);
  if (!parsedBody.success) return { error: parsedBody.error.message };

  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const { title, amount, category, date, type, currency, categoryIcon } =
    parsedBody.data;

  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: category,
      icon: categoryIcon,
    },
  });
  if (!categoryRow) return { error: "Category not found!" };

  await prisma.$transaction([
    prisma.transaction.create({
      data: {
        userId: user.id,
        title,
        amount,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
        date,
        type,
        currency,
      },
    }),

    prisma.monthTable.upsert({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        income: type === "income" ? amount : 0,
        expense: type === "expense" ? amount : 0,
      },
      update: {
        income: {
          increment: type === "income" ? amount : 0,
        },
        expense: {
          increment: type === "expense" ? amount : 0,
        },
      },
    }),

    prisma.yearTable.upsert({
      where: {
        month_year_userId: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        income: type === "income" ? amount : 0,
        expense: type === "expense" ? amount : 0,
      },
      update: {
        income: {
          increment: type === "income" ? amount : 0,
        },
        expense: {
          increment: type === "expense" ? amount : 0,
        },
      },
    }),
  ]);
}
