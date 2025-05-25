"use server";

import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import { createExchangeSchema, createExchangeType } from "@/schema/exchange";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function createExchange(form: createExchangeType) {
  const parsedBody = createExchangeSchema.safeParse(form);
  if (!parsedBody.success) return { error: parsedBody.error.message };

  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const {
    title,
    exchangeAmount,
    collectedAmount,
    date,
    exchangeCurrency,
    targetCurrency,
  } = parsedBody.data;

  await prisma.$transaction([
    prisma.exchange.create({
      data: {
        userId: user.id,
        title,
        exchangeAmount,
        collectedAmount,
        date,
        exchangeCurrency,
        targetCurrency,
      },
    }),

    prisma.monthTable.upsert({
      where: {
        day_month_year_userId_currency: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
          currency: exchangeCurrency,
        },
      },
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        income: 0,
        expense: exchangeAmount,
        currency: exchangeCurrency,
      },
      update: {
        expense: {
          increment: exchangeAmount,
        },
      },
    }),
    prisma.monthTable.upsert({
      where: {
        day_month_year_userId_currency: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
          currency: targetCurrency,
        },
      },
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        income: collectedAmount,
        expense: 0,
        currency: targetCurrency,
      },
      update: {
        income: {
          increment: collectedAmount,
        },
      },
    }),

    prisma.yearTable.upsert({
      where: {
        month_year_userId_currency: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
          currency: exchangeCurrency,
        },
      },
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        income: 0,
        expense: exchangeAmount,
        currency: exchangeCurrency,
      },
      update: {
        expense: {
          increment: exchangeAmount,
        },
      },
    }),
    prisma.yearTable.upsert({
      where: {
        month_year_userId_currency: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
          currency: targetCurrency,
        },
      },
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        income: collectedAmount,
        expense: 0,
        currency: targetCurrency,
      },
      update: {
        income: {
          increment: collectedAmount,
        },
      },
    }),
  ]);
}
