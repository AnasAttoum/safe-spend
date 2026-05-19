import { routes } from "@/config/routes";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET() {
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const bookmarks = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      bookmark: true,
    },
    orderBy: [
      { type: "desc" },
      { date: "desc" },
      { createdAt: "desc" }
    ],
    include: {
      Category: {
        select: {
          name: true,
          icon: true,
        },
      },
    },
  });
  return Response.json(bookmarks);
}
