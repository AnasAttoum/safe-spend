"use server";

import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import { deleteSchema, deleteSchemaType } from "@/schema/category";
import { currentUser } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export async function removeBookmark(form: deleteSchemaType) {
  const t = await getTranslations("errors");
  const parsedBody = deleteSchema(t).safeParse(form);
  if (!parsedBody.success) return { error: t("bad-request") };

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
    return { error: t("transaction-not-found") };
  }

  return await prisma.transaction.update({
    where: {
      userId: user.id,
      id,
    },
    data: {
      bookmark: false,
    },
  });
}
