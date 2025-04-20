"use client";

import { DarkModeToggle } from "@/components/dark-mode-toggle";
import Icon from "@/components/icon/icon";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserButton } from "@clerk/nextjs";
import HeaderLinks from "./links";
import { useState } from "react";

export default function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="grid md:hidden grid-cols-2 border-b h-14">
      <div className="flex items-center gap-3 pr-1">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Icon icon="hamb" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full p-3">
            <SheetHeader>
              <SheetTitle className="flex justify-center">
                <Logo />
              </SheetTitle>
              {/* <SheetDescription>
                Make changes to your profile here. Click save when you're done.
              </SheetDescription> */}
            </SheetHeader>
            <HeaderLinks setOpen={setOpen}/>
            {/* <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
            </SheetFooter> */}
          </SheetContent>
        </Sheet>
      <Logo />
      </div>

      <div className="flex items-center justify-end gap-3 ">
        <DarkModeToggle />
        <UserButton />
      </div>
    </header>
  );
}
