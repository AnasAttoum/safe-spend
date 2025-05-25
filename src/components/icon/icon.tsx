import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type Props = {
  icon: string;
  size?: number;
  rotate?: boolean;
  className?: string;
};

export default function Icon({
  icon,
  size = 20,
  rotate = false,
  className = "",
}: Props) {
  return (
    <Image
      src={`/assets/icons/${icon}.svg`}
      alt={icon}
      width={size}
      height={size}
      className={cn(
        rotate && "animate-spin [animation-duration:8s]",
        className
      )}
    />
  );
}
