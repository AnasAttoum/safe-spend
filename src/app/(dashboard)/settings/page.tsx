import { Metadata } from "next";
import Settings from "@/sections/settings";

export const metadata: Metadata = {
  title: "Settings",
};

export default function page() {
  return <Settings />;
}
