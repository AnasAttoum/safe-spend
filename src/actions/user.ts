"use server";

import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import { updateUserCurrencySchema } from "@/schema/user";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function updateUserCurrency(currency: string) {
  const parsedBody = updateUserCurrencySchema.safeParse({ currency });

  if (!parsedBody.success) throw parsedBody.error;

  const user = await currentUser();

  if (!user) redirect(routes.signIn);

  const updatedUser = prisma.user.update({
    where: {
      userId: user.id,
    },
    data: {
      currency,
    },
  });

  return updatedUser;
}
