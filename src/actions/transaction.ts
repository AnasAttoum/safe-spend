"use server";

import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import { deleteSchema, deleteSchemaType } from "@/schema/category";
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

  const { title, amount, categoryId, date, type, currency } = parsedBody.data;

  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      id: categoryId,
    },
  });
  if (!categoryRow) return { error: "Category not found!" };

  await prisma.$transaction([
    prisma.transaction.create({
      data: {
        userId: user.id,
        title,
        amount,
        categoryId: categoryRow.id,
        date,
        type,
        currency,
      },
    }),

    prisma.monthTable.upsert({
      where: {
        day_month_year_userId_currency: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
          currency,
        },
      },
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        income: type === "income" ? amount : 0,
        expense: type === "expense" ? amount : 0,
        currency,
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
        month_year_userId_currency: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
          currency,
        },
      },
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        income: type === "income" ? amount : 0,
        expense: type === "expense" ? amount : 0,
        currency,
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

export async function deleteTransaction(form: deleteSchemaType) {
  const parsedBody = deleteSchema.safeParse(form);
  if (!parsedBody.success) return { error: "Bad request!" };

  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const id = parsedBody.data;

  const transaction = await prisma.transaction.findFirst({
    where: {
      userId: user.id,
      id,
    },
  });
  if (!transaction) {
    return { error: "This transaction not exist!" };
  }

  return await prisma.$transaction([
    prisma.transaction.delete({
      where: {
        userId: user.id,
        id,
      },
    }),

    prisma.monthTable.update({
      where: {
        day_month_year_userId_currency: {
          day: transaction.date.getUTCDate(),
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getFullYear(),
          userId: user.id,
          currency: transaction.currency,
        },
      },
      data: {
        ...(transaction.type === "income" && {
          income: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === "expense" && {
          expense: {
            decrement: transaction.amount,
          },
        }),
      },
    }),

    prisma.yearTable.update({
      where: {
        month_year_userId_currency: {
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getFullYear(),
          userId: user.id,
          currency: transaction.currency,
        },
      },
      data: {
        ...(transaction.type === "income" && {
          income: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === "expense" && {
          expense: {
            decrement: transaction.amount,
          },
        }),
      },
    }),
  ]);
}
