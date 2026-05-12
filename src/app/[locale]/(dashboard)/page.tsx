import { Metadata } from "next";
import Dashboard from "@/sections/dashboard";
import { getCategory } from "@/actions/category";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ categoryId?: string }> }): Promise<Metadata> {
  const { categoryId } = await searchParams;
  const response = await getCategory(categoryId || '')

  return {
    title: response?.category?.name || "Dashboard",
  }
}

export default async function page({ searchParams }: { searchParams: Promise<{ categoryId?: string }> }) {
  const { categoryId } = await searchParams;
  const response = await getCategory(categoryId || '')

  return <Dashboard categoryOverview={response} />;
}
