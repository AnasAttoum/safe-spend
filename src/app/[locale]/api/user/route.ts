import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET() {
  const user = await currentUser();

  if (!user) redirect("/");

  const userSettings = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  revalidatePath("/");
  return Response.json(userSettings);
}
