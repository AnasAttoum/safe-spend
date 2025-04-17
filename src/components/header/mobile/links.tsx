"use client";

import Link from "next/link";

import { headerlinks } from "@/config/header/links";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type Props = {
  setOpen: (value: boolean) => void;
};

export default function HeaderLinks({ setOpen }: Props) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col">
      {headerlinks.map(({ label, link }) => {
        const isActive = link === pathname;
        return (
          <Link
            key={label}
            href={link}
            className={clsx(
              "relative w-full text-center my-1 p-3 rounded-md transition-all duration-200",
              isActive && "text-blue-secondary bg-gray-700"
            )}
            onClick={() => setOpen(false)}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
