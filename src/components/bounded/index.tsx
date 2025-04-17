import clsx from "clsx";
import { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

export default function Bounded({ children, className }: Props) {
  return <div className={clsx("max-w-6xl mx-auto p-2 px-4", className)}>{children}</div>;
}
