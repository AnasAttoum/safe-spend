import { Metadata } from "next";
import Categories from "@/sections/categories";

export const metadata: Metadata = {
  title: "Categories",
};

export default function page() {
  return <Categories />;
}
