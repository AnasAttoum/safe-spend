import { Metadata } from "next";
import GoldToday from "@/sections/gold-today";

export const metadata: Metadata = {
  title: "Gold Today",
};

export default function page() {
  return <GoldToday />;
}
