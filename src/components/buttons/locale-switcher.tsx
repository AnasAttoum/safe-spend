"use client";

import { usePathname, useRouter } from "@/lib/localization/navigation";
import { localesDetails, localesType } from "@/lib/localization/routing";
import clsx from "clsx";
import { useLocale } from "next-intl";
import Image from "next/image";
import { startTransition, useState } from "react";
import { Button } from "../ui/button";

export default function LocaleSwitcher() {

  const locale = useLocale();
  const localeObj = localesDetails.find((loc) => loc.locale === locale) || localesDetails[0];

  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (loc: localesType) => {
    if (loc === locale) return;
    startTransition(() => {
      router.replace(
        { pathname },
        { locale: loc }
      );
    });
    router.refresh();
  }


  return (
    <div className="relative overflow-visible" onBlur={() => setIsOpen(false)}>
      <Button variant="secondary" className="simpleBtnFocus" onClick={() => setIsOpen((prev) => !prev)}>
        <Image
          src={localeObj?.src}
          alt={localeObj?.label}
          width={18}
          height={18}
        />
      </Button>

      <div className={clsx(
        "flex flex-col absolute top-11 bg-safeSpend-primary text-white rounded-md transition z-50",
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      )}>
        {localesDetails.map((loc, i) => {
          const isActive = locale === loc.locale
          return (
            <Button
              key={loc.locale}
              variant="ghost"
              disabled={isActive}
              onClick={() => switchLocale(loc.locale)}
              className={clsx(
                "flex justify-evenly px-5 py-2 gap-2 w-20",
                i === 0 && "rounded-t-md",
                (i + 1) === localesDetails.length && "rounded-b-md",
                isActive ? "cursor-not-allowed" : "hover:bg-white! hover:text-safeSpend-secondary cursor-pointer"
              )}
            >
              <Image
                src={loc?.src}
                alt={loc?.label}
                width={18}
                height={18}
              />
              <p>{loc.label}</p>
            </Button>
          )
        })}
      </div>
    </div>
  );
}
