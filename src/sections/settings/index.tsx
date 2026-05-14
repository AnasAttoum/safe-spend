import { currentUser } from "@clerk/nextjs/server";
import { DeleteMyDataDialog } from "@/components/dialog/delete-my-data-dialog";
import Currency from "./views/currency";
import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";

export default async function Settings() {
  const t = await getTranslations("settings");
  const user = await currentUser();
  if (!user) redirect(routes.signIn);

  const userData = await prisma.user.findUnique({ where: { userId: user.id } });
  if (!userData) redirect(routes.currency);

  return (
    <>
      <div className="py-3">
        <h3 className="text-3xl">{t("settings")}</h3>
        <p className="text-sm text-gray-500">
          {t("manage")}
        </p>
      </div>

      <Currency />

      <DeleteMyDataDialog />
    </>
  );
}
