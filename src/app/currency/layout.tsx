import { Metadata } from "next";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: "Currency",
};

export default function layout({ children }: Props) {
  return (
    <div className="h-dvh flex justify-center items-center">{children}</div>
  );
}
