"use server";

import { prisma } from "@/lib/prisma";
import { deleteSchema, deleteSchemaType } from "@/schema/category";
import { getTranslations } from "next-intl/server";
import { currentUser } from "./user";

export async function removeBookmark(form: deleteSchemaType) {
  const t = await getTranslations("errors");
  const parsedBody = deleteSchema(t).safeParse(form);
  if (!parsedBody.success) return { error: t("bad-request") };

  const user = await currentUser();

  const id = parsedBody.data;

  const transaction = await prisma.transaction.findFirst({
    where: {
      userId: user?.id,
      id,
    },
  });
  if (!transaction) {
    return { error: t("transaction-not-found") };
  }

  return await prisma.transaction.update({
    where: {
      userId: user?.id,
      id,
    },
    data: {
      bookmark: false,
    },
  });
}
