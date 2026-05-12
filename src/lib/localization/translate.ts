import { Information } from "@/app/generated/prisma/client";
import { localesType } from "./routing";

export const translate = (
  data: Information | null,
  key: string,
  locale: localesType,
) => {
  if (!data || !key || !locale) return "";

  return (data?.[`${key}_${locale}` as keyof Information] as string) || "";
};
