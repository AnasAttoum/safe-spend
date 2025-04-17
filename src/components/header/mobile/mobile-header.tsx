"use client";

import { DarkModeToggle } from "@/components/dark-mode-toggle";
import Icon from "@/components/icon/icon";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
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
    <header className="grid md:hidden grid-cols-4 border-b h-14">
      <div className="flex justify-end items-center gap-1 pr-1">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="mr-5">
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
      </div>
      <Logo className="-ml-4" />

      <div className="flex items-center justify-end gap-3 col-span-2">
        <DarkModeToggle />
        <UserButton />
      </div>
    </header>
  );
}
