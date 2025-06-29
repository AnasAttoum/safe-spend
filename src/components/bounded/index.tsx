import clsx from "clsx";
import { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

export default function Bounded({ children, className }: Props) {
  return <div className={clsx("w-full mx-auto py-2 px-4 md:pe-10 overflow-auto", className)}>{children}</div>;
}
