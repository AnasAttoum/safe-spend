"use server";

import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import {
  createCategorySchema,
  CreateCategorySchemaType,
} from "@/schema/category";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function createCategory(form: CreateCategorySchemaType) {
  const parsedBody = createCategorySchema.safeParse(form);
  if (!parsedBody.success) throw new Error("Bad request!");

  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const { name, type, icon } = parsedBody.data;

  return await prisma.category.create({
    data: {
      userId: user.id,
      name,
      type,
      icon,
    },
  });
}
