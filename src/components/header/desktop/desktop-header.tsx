import { DarkModeToggle } from "@/components/dark-mode-toggle";
import Logo from "@/components/logo";
import { UserButton } from "@clerk/nextjs";
import HeaderLinks from "./links";

export default function DesktopHeader() {
  return (
    <header className="md:grid grid-cols-4 border-b h-14 hidden">
      <Logo />
      <div className="col-span-2 flex justify-evenly">
        <HeaderLinks />
      </div>
      <div className="flex items-center justify-end gap-3">
        <DarkModeToggle />
        <UserButton />
      </div>
    </header>
  );
}
