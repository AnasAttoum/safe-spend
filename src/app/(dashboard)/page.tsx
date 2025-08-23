import { Metadata } from "next";
import Dashboard from "@/sections/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function page({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  return <Dashboard id={id} />;
}
