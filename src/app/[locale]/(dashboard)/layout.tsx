import Bounded from "@/components/bounded";
import Header from "@/components/header/header";
import { AppSidebar } from "@/components/sidebar";
import SidebarProviderHandler from "@/providers/sidebar-provider-handler";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <SidebarProviderHandler>
      <AppSidebar />
      <Bounded>
        <Header />
        {children}
      </Bounded>
    </SidebarProviderHandler>
  );
}
