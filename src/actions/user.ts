"use server";

import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import { updateUserCurrencySchema } from "@/schema/user";
import { currentUser } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export async function updateUserCurrency(currency: string) {
  const t = await getTranslations("errors");
  const parsedBody = updateUserCurrencySchema(t).safeParse({ currency });

  if (!parsedBody.success) throw parsedBody.error;

  const user = await currentUser();

  if (!user) redirect(routes.signIn);

  const updatedUser = await prisma.user.update({
    where: {
      userId: user.id,
    },
    data: {
      currency,
    },
  });

  return updatedUser;
}
