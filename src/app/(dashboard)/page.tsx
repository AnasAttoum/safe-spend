import { Metadata } from "next";
import Dashboard from "@/sections/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function page({ searchParams }: { searchParams: Promise<{ categoryId?: string }> }) {
  const { categoryId } = await searchParams;
  return <Dashboard categoryId={categoryId} />;
}
