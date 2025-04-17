import Image from "next/image";
import React from "react";

type Props = {
  icon: string;
  size?: number;
};

export default function Icon({ icon, size = 20 }: Props) {
  return (
    <Image
      src={`/assets/icons/${icon}.svg`}
      alt={icon}
      width={size}
      height={size}
    />
  );
}
