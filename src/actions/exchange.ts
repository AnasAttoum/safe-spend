"use server";

import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import { deleteSchema, deleteSchemaType } from "@/schema/category";
import {
  createExchangeSchema,
  createExchangeType,
  updateExchangeSchema,
  updateExchangeType,
} from "@/schema/exchange";
import { currentUser } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export async function createExchange(form: createExchangeType) {
  const t = await getTranslations("errors");
  const parsedBody = createExchangeSchema.safeParse(form);
  if (!parsedBody.success) return { error: t(parsedBody.error.message) };

  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const {
    title = "",
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

    // prisma.monthTable.upsert({
    //   where: {
    //     day_month_year_userId_currency: {
    //       userId: user.id,
    //       day: date.getUTCDate(),
    //       month: date.getUTCMonth(),
    //       year: date.getUTCFullYear(),
    //       currency: exchangeCurrency,
    //     },
    //   },
    //   create: {
    //     userId: user.id,
    //     day: date.getUTCDate(),
    //     month: date.getUTCMonth(),
    //     year: date.getUTCFullYear(),
    //     income: 0,
    //     expense: exchangeAmount,
    //     currency: exchangeCurrency,
    //   },
    //   update: {
    //     expense: {
    //       increment: exchangeAmount,
    //     },
    //   },
    // }),
    // prisma.monthTable.upsert({
    //   where: {
    //     day_month_year_userId_currency: {
    //       userId: user.id,
    //       day: date.getUTCDate(),
    //       month: date.getUTCMonth(),
    //       year: date.getUTCFullYear(),
    //       currency: targetCurrency,
    //     },
    //   },
    //   create: {
    //     userId: user.id,
    //     day: date.getUTCDate(),
    //     month: date.getUTCMonth(),
    //     year: date.getUTCFullYear(),
    //     income: collectedAmount,
    //     expense: 0,
    //     currency: targetCurrency,
    //   },
    //   update: {
    //     income: {
    //       increment: collectedAmount,
    //     },
    //   },
    // }),

    // prisma.yearTable.upsert({
    //   where: {
    //     month_year_userId_currency: {
    //       userId: user.id,
    //       month: date.getUTCMonth(),
    //       year: date.getUTCFullYear(),
    //       currency: exchangeCurrency,
    //     },
    //   },
    //   create: {
    //     userId: user.id,
    //     month: date.getUTCMonth(),
    //     year: date.getUTCFullYear(),
    //     income: 0,
    //     expense: exchangeAmount,
    //     currency: exchangeCurrency,
    //   },
    //   update: {
    //     expense: {
    //       increment: exchangeAmount,
    //     },
    //   },
    // }),
    // prisma.yearTable.upsert({
    //   where: {
    //     month_year_userId_currency: {
    //       userId: user.id,
    //       month: date.getUTCMonth(),
    //       year: date.getUTCFullYear(),
    //       currency: targetCurrency,
    //     },
    //   },
    //   create: {
    //     userId: user.id,
    //     month: date.getUTCMonth(),
    //     year: date.getUTCFullYear(),
    //     income: collectedAmount,
    //     expense: 0,
    //     currency: targetCurrency,
    //   },
    //   update: {
    //     income: {
    //       increment: collectedAmount,
    //     },
    //   },
    // }),
  ]);
}

export async function deleteExchange(form: deleteSchemaType) {
  const t = await getTranslations("errors");
  const parsedBody = deleteSchema.safeParse(form);
  if (!parsedBody.success) return { error: t(parsedBody.error.message) };

  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const id = parsedBody.data;

  const exchange = await prisma.exchange.findFirst({
    where: {
      userId: user.id,
      id,
    },
  });
  if (!exchange) {
    return { error: t("exchange-not-found") };
  }

  await prisma.$transaction([
    prisma.exchange.delete({
      where: {
        userId: user.id,
        id,
      },
    }),

    // prisma.monthTable.update({
    //   where: {
    //     day_month_year_userId_currency: {
    //       userId: user.id,
    //       day: exchange.date.getUTCDate(),
    //       month: exchange.date.getUTCMonth(),
    //       year: exchange.date.getUTCFullYear(),
    //       currency: exchange.exchangeCurrency,
    //     },
    //   },
    //   data: {
    //     expense: {
    //       decrement: exchange.exchangeAmount,
    //     },
    //   },
    // }),
    // prisma.monthTable.update({
    //   where: {
    //     day_month_year_userId_currency: {
    //       userId: user.id,
    //       day: exchange.date.getUTCDate(),
    //       month: exchange.date.getUTCMonth(),
    //       year: exchange.date.getUTCFullYear(),
    //       currency: exchange.targetCurrency,
    //     },
    //   },
    //   data: {
    //     income: {
    //       decrement: exchange.collectedAmount,
    //     },
    //   },
    // }),

    // prisma.yearTable.update({
    //   where: {
    //     month_year_userId_currency: {
    //       userId: user.id,
    //       month: exchange.date.getUTCMonth(),
    //       year: exchange.date.getUTCFullYear(),
    //       currency: exchange.exchangeCurrency,
    //     },
    //   },
    //   data: {
    //     expense: {
    //       decrement: exchange.exchangeAmount,
    //     },
    //   },
    // }),
    // prisma.yearTable.update({
    //   where: {
    //     month_year_userId_currency: {
    //       userId: user.id,
    //       month: exchange.date.getUTCMonth(),
    //       year: exchange.date.getUTCFullYear(),
    //       currency: exchange.targetCurrency,
    //     },
    //   },
    //   data: {
    //     income: {
    //       decrement: exchange.collectedAmount,
    //     },
    //   },
    // }),
  ]);
}

export async function updateExchange(form: updateExchangeType) {
  const t = await getTranslations("errors");
  const parsedBody = updateExchangeSchema.safeParse(form);
  if (!parsedBody.success) return { error: t(parsedBody.error.message) };

  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const {
    id: exchangeId,
    title,
    exchangeAmount,
    collectedAmount,
    date,
    exchangeCurrency,
    targetCurrency,
  } = parsedBody.data;

  const exchange = await prisma.exchange.findFirst({
    where: {
      userId: user.id,
      id: exchangeId,
    },
  });
  if (!exchange) {
    return { error: t("exchange-not-found") };
  }

  await prisma.$transaction([
    prisma.exchange.update({
      where: {
        userId: user.id,
        id: exchangeId,
      },
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

    // remove old exchange
    // prisma.monthTable.update({
    //   where: {
    //     day_month_year_userId_currency: {
    //       userId: user.id,
    //       day: exchange.date.getUTCDate(),
    //       month: exchange.date.getUTCMonth(),
    //       year: exchange.date.getUTCFullYear(),
    //       currency: exchange.exchangeCurrency,
    //     },
    //   },
    //   data: {
    //     expense: {
    //       decrement: exchange.exchangeAmount,
    //     },
    //   },
    // }),
    // prisma.monthTable.update({
    //   where: {
    //     day_month_year_userId_currency: {
    //       userId: user.id,
    //       day: exchange.date.getUTCDate(),
    //       month: exchange.date.getUTCMonth(),
    //       year: exchange.date.getUTCFullYear(),
    //       currency: exchange.targetCurrency,
    //     },
    //   },
    //   data: {
    //     income: {
    //       decrement: exchange.collectedAmount,
    //     },
    //   },
    // }),
    // prisma.yearTable.update({
    //   where: {
    //     month_year_userId_currency: {
    //       userId: user.id,
    //       month: exchange.date.getUTCMonth(),
    //       year: exchange.date.getUTCFullYear(),
    //       currency: exchange.exchangeCurrency,
    //     },
    //   },
    //   data: {
    //     expense: {
    //       decrement: exchange.exchangeAmount,
    //     },
    //   },
    // }),
    // prisma.yearTable.update({
    //   where: {
    //     month_year_userId_currency: {
    //       userId: user.id,
    //       month: exchange.date.getUTCMonth(),
    //       year: exchange.date.getUTCFullYear(),
    //       currency: exchange.targetCurrency,
    //     },
    //   },
    //   data: {
    //     income: {
    //       decrement: exchange.collectedAmount,
    //     },
    //   },
    // }),

    // add new exchange
    // prisma.monthTable.upsert({
    //   where: {
    //     day_month_year_userId_currency: {
    //       userId: user.id,
    //       day: date.getUTCDate(),
    //       month: date.getUTCMonth(),
    //       year: date.getUTCFullYear(),
    //       currency: exchangeCurrency,
    //     },
    //   },
    //   create: {
    //     userId: user.id,
    //     day: date.getUTCDate(),
    //     month: date.getUTCMonth(),
    //     year: date.getUTCFullYear(),
    //     income: 0,
    //     expense: exchangeAmount,
    //     currency: exchangeCurrency,
    //   },
    //   update: {
    //     expense: {
    //       increment: exchangeAmount,
    //     },
    //   },
    // }),
    // prisma.monthTable.upsert({
    //   where: {
    //     day_month_year_userId_currency: {
    //       userId: user.id,
    //       day: date.getUTCDate(),
    //       month: date.getUTCMonth(),
    //       year: date.getUTCFullYear(),
    //       currency: targetCurrency,
    //     },
    //   },
    //   create: {
    //     userId: user.id,
    //     day: date.getUTCDate(),
    //     month: date.getUTCMonth(),
    //     year: date.getUTCFullYear(),
    //     income: collectedAmount,
    //     expense: 0,
    //     currency: targetCurrency,
    //   },
    //   update: {
    //     income: {
    //       increment: collectedAmount,
    //     },
    //   },
    // }),

    // prisma.yearTable.upsert({
    //   where: {
    //     month_year_userId_currency: {
    //       userId: user.id,
    //       month: date.getUTCMonth(),
    //       year: date.getUTCFullYear(),
    //       currency: exchangeCurrency,
    //     },
    //   },
    //   create: {
    //     userId: user.id,
    //     month: date.getUTCMonth(),
    //     year: date.getUTCFullYear(),
    //     income: 0,
    //     expense: exchangeAmount,
    //     currency: exchangeCurrency,
    //   },
    //   update: {
    //     expense: {
    //       increment: exchangeAmount,
    //     },
    //   },
    // }),
    // prisma.yearTable.upsert({
    //   where: {
    //     month_year_userId_currency: {
    //       userId: user.id,
    //       month: date.getUTCMonth(),
    //       year: date.getUTCFullYear(),
    //       currency: targetCurrency,
    //     },
    //   },
    //   create: {
    //     userId: user.id,
    //     month: date.getUTCMonth(),
    //     year: date.getUTCFullYear(),
    //     income: collectedAmount,
    //     expense: 0,
    //     currency: targetCurrency,
    //   },
    //   update: {
    //     income: {
    //       increment: collectedAmount,
    //     },
    //   },
    // }),
  ]);
}
