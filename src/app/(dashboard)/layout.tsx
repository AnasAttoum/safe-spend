import Navbar from "@/components/header/header";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
