import { currentUser } from "@/actions/user";
import Bounded from "@/components/bounded";
import Header from "@/components/header/header";
import { AppSidebar } from "@/components/sidebar";
import { routes } from "@/config/routes";
import { redirect } from "@/lib/localization/navigation";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function Layout({ children, params }: Props) {
  const { locale } = await params;

  const user = await currentUser();

  if (!user?.currency)
    return redirect({
      href: routes.currency,
      locale
    });

  return (
    <>
      <AppSidebar />
      <Bounded>
        <Header />
        {children}
      </Bounded>
    </>
  );
}
