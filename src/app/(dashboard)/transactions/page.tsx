import { Metadata } from "next";
import Transactions from "@/sections/transactions";

export const metadata: Metadata = {
  title: "Transactions",
};

export default function page() {
  return <Transactions />;
}
