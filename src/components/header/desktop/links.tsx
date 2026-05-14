"use client";

import { headerlinks } from "@/config/header-links";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Link } from "@/lib/localization/navigation";

export default function HeaderLinks() {
  const pathname = usePathname();

  return headerlinks.map(({ label, link }) => {
    const isActive = link === pathname;
    return (
      <div key={label} className="relative h-full flex items-center">
        <Link
          href={link ?? '/'}
          className={clsx(
            "hover:text-safeSpend-primary transition-all duration-200",
            isActive && "text-safeSpend-primary"
          )}
        >
          {label}
        </Link>
        <div
          className={clsx(
            isActive &&
            "absolute -bottom-0.5 w-full border-2 border-safeSpend-primary transition-all duration-200"
          )}
        ></div>
      </div>
    );
  });
}
