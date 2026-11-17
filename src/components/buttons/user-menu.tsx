import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getTranslations } from "next-intl/server";
import { currentUser } from "@/actions/user";
import { logout } from "@/lib/session";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default async function UserMenu() {
  const t = await getTranslations("auth");
  const user = await currentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="px-2 cursor-pointer w-12.5"
          aria-label="Open profile list"
        >
          <Avatar>
            <AvatarImage alt={user?.fName} src={user?.profileImage || ""} />
            <AvatarFallback>{user?.fName.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {/* <DropdownMenuItem>
          <Link href="/profile" className="flex">
            <UserRound className="mr-2 size-4" />
            {t("my-profile")}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator /> */}

        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          <LogOut className="mr-2 size-4" />
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}