import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) redirect("/");

  let userSettings = await prisma.user.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings)
    userSettings = await prisma.user.create({
      data: {
        userId: user.id,
        currency: "USD",
      },
    });

    revalidatePath('/')
    return Response.json(userSettings)
}
