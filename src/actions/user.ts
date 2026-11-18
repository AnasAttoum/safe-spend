"use server";

import bcrypt from "bcryptjs";
import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import { createSession, getSessionUserId } from "@/lib/session";
import {
  signInSchema,
  signInType,
  signUpSchema,
  signUpType,
} from "@/schema/auth";
import { updateUserCurrencySchema } from "@/schema/user";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export async function currentUser() {
  const userId = await getSessionUserId();
  if (!userId) redirect(routes.signIn);

  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fName: true,
      lName: true,
      email: true,
      currency: true,
      profileImage: true,
    },
  });
}
export type currentUserType = ReturnType<typeof currentUser>;

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

  return { data: { fName: user.fName, currency: user.currency } };
}

export async function signUp(data: signUpType) {
  const t = await getTranslations("errors");
  const parsedBody = signUpSchema(t).safeParse(data);

  if (!parsedBody.success) {
    return { error: t("something-went-wrong") };
  }

  const { fName, lName, email, password, confirmPassword } = parsedBody.data;

  if (password !== confirmPassword) return { error: t("passwords-dont-match") };

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });

  if (existingUser) {
    return { error: t("email-already-exists") };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const user = await prisma.user.create({
      data: {
        fName: fName.trim(),
        lName: lName.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      },
      select: {
        id: true,
        fName: true,
      },
    });

    await createSession(user.id);

    return { data: { fName: user.fName } };
  } catch {
    // يغطي أيضًا حالة إنشاء الحسابين بالبريد نفسه في الوقت نفسه.
    return { error: t("email-already-exists") };
  }
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
