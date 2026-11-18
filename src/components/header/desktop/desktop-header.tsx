import Logo from "@/components/logo";
import SettingsBtn from "@/components/buttons/settings-btn";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeBtn from "@/components/buttons/theme-btn";
import LocaleSwitcher from "@/components/buttons/locale-switcher";
import UserMenu from "@/components/buttons/user-menu";

export default function DesktopHeader({ simple = false }: { simple?: boolean }) {
  return (
    <header className="flex items-center justify-between border-b h-14">
      <div className="flex gap-2 items-center">
        {!simple && <SidebarTrigger />}
        <Logo />
      </div>
      {/* <div className="col-span-2 flex justify-evenly">
        <HeaderLinks />
      </div> */}
      <div className="flex items-center justify-end gap-3">
        <SettingsBtn />
        <ThemeBtn />
        <LocaleSwitcher />
        {!simple && <UserMenu />}
      </div>
    </header>
  );
}
