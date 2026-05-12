import { Metadata } from "next";
import SyrianPoundToday from "@/sections/syrian-pound-today";

export const metadata: Metadata = {
  title: "Syrian Pound Today",
};

export default function page() {
  return <SyrianPoundToday />;
}
