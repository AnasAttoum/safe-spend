import { Column } from "@tanstack/react-table";
import { BookmarkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface DataTableBookmarkFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
}

export function DataTableBookmarkFilter<TData, TValue>({
  column,
}: DataTableBookmarkFilterProps<TData, TValue>) {
  const t = useTranslations("delete-dialog");

  const isActive = column?.getFilterValue() === true;

  return (
    <Button
      variant={isActive ? "default" : "secondary"}
      size="sm"
      className={cn("h-8", isActive && "bg-safeSpend-primary text-white hover:bg-safeSpend-primary")}
      onClick={() => {
        column?.setFilterValue(isActive ? undefined : true);
      }}
    >
      <BookmarkIcon className={isActive ? "fill-white text-white" : "fill-safeSpend-primary text-safeSpend-primary"} />
      {t("bookmark")}
    </Button>
  );
}