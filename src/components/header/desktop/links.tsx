"use client";

import Link from "next/link";

import { headerlinks } from "@/config/header-links";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function HeaderLinks() {
  const pathname = usePathname();

  return headerlinks.map(({ label, link }) => {
    const isActive = link === pathname;
    return (
      <div key={label} className="relative h-full flex items-center">
        <Link
          href={link}
          className={clsx(
            "hover:text-blue-primary transition-all duration-200",
            isActive && "text-blue-primary"
          )}
        >
          {label}
        </Link>
        <div
          className={clsx(
            isActive &&
              "absolute -bottom-0.5 w-full border-2 border-blue-primary transition-all duration-200"
          )}
        ></div>
      </div>
    );
  });
}
