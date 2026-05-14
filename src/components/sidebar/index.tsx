import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import Menu from "./menu"
import { getTranslations } from "next-intl/server"

export async function AppSidebar() {
  const t = await getTranslations("dashboard");
  // const user = await currentUser();
  // if (!user) redirect(routes.signIn);

  // const userData = await prisma.user.findUnique({ where: { userId: user.id } });
  // if (!userData) redirect(routes.currency);

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 text-gray-300 uppercase">
            {t("pages")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <Menu
            // SYPCurrency={userData.currency==='SYP'} 
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}