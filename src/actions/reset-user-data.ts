"use server";

import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function resetUserData() {
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  await prisma.$transaction([
    prisma.category.deleteMany({ where: { userId: user.id } }),
    prisma.exchange.deleteMany({ where: { userId: user.id } }),
    prisma.monthTable.deleteMany({ where: { userId: user.id } }),
    prisma.transaction.deleteMany({ where: { userId: user.id } }),
    prisma.yearTable.deleteMany({ where: { userId: user.id } }),
    prisma.user.delete({ where: { userId: user.id } }),
  ]);
}
