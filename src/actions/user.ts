"use server";

import bcrypt from "bcryptjs";
import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { signInSchema, signInType } from "@/schema/auth";
import { updateUserCurrencySchema } from "@/schema/user";
import { currentUser } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export async function signIn(data: signInType) {
  const t = await getTranslations("errors");
  const parsedBody = signInSchema(t).safeParse(data);

  if (!parsedBody.success) return { error: t("something-went-wrong") };

  const { email, password } = parsedBody.data;

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: t("invalid-credentials") };
  }

  await createSession(user.id);

  return { data: { fName: user.fName } };
}

export async function updateUserCurrency(currency: string) {
  const t = await getTranslations("errors");
  const parsedBody = updateUserCurrencySchema(t).safeParse({ currency });

  if (!parsedBody.success) throw parsedBody.error;

  const user = await currentUser();

  if (!user) redirect(routes.signIn);

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      currency,
    },
  });

  return updatedUser;
}
