import Logo from "@/components/logo";
import { UserButton } from "@clerk/nextjs";
import SettingsBtn from "@/components/buttons/settings-btn";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeBtn from "@/components/buttons/theme-btn";

export default function DesktopHeader() {
  return (
    <header className="flex items-center justify-between border-b h-14">
      <div className="flex gap-2 items-center">
        <SidebarTrigger />
        <Logo />
      </div>
      {/* <div className="col-span-2 flex justify-evenly">
        <HeaderLinks />
      </div> */}
      <div className="flex items-center justify-end gap-3">
        <SettingsBtn />
        <ThemeBtn />
        <UserButton />
      </div>
    </header>
  );
}
