"use client";
import { format } from "date-fns";

export function Time({ iso }: { iso: string }) {
  const d = new Date(iso);
  return format(d, "d.M.yyyy - h:mm a");
}
