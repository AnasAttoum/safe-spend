"use server";

import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { currentUser } from "./user";

export async function resetUserData() {
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  await prisma.$transaction([
    prisma.transaction.deleteMany({ where: { userId: user.id } }),
    prisma.category.deleteMany({ where: { userId: user.id } }),
    prisma.exchange.deleteMany({ where: { userId: user.id } }),
    // prisma.monthTable.deleteMany({ where: { userId: user.id } }),
    // prisma.yearTable.deleteMany({ where: { userId: user.id } }),
    prisma.user.delete({ where: { id: user.id } }),
  ]);
}
