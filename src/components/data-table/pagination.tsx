import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { Transaction } from "@/generated/prisma";
import { useState } from "react";
import Count from "../count-up";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const t = useTranslations();
  const [showTotal, setShowTotal] = useState(false);

  const result = table.getFilteredRowModel().rows.reduce((total, row) => {
    const { currency, type, amount } = row.original as Transaction;
    const currentAmount = type === "expense" ? -amount : amount;

    const found = total?.find((el) => el?.currency === currency)
    if (found) {
      return total.map((el) => el.currency === currency ? { currency, total: el.total + currentAmount } : el)
    }
    return [...total, { currency, total: currentAmount }]
  }, [] as { currency: string; total: number }[]);

  return (
    <div className="flex flex-wrap gap-3 items-center justify-end p-2">
      <div className="flex flex-wrap gap-2 flex-1 text-sm text-muted-foreground">
        {/* {table.getFilteredSelectedRowModel().rows.length} of{" "} */}
        <span>{table.getFilteredRowModel().rows.length}{" "}</span>
        <span>{table.getFilteredRowModel().rows.length > 1 ? t("rows") : t("row")}</span>

        {!!result?.length && !showTotal && <Button variant="secondary" className="h-6" onClick={() => setShowTotal(true)}>
          <MoreHorizontal />
        </Button>}

        {!!result?.length && showTotal && <div className="flex flex-wrap gap-2">
          <span>-</span>
          {result.map(({ currency, total }, index) => <div key={currency} className="flex gap-2">
            {currency}: <Count num={total} />
            {index !== result.length - 1 && " | "}
          </div>)}
        </div>}
      </div>
      <div className="flex flex-wrap items-center gap-2 space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{t("rows-per-page")}</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-17.5">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <div className="flex w-25 items-center justify-center text-sm font-medium">
            {t("page-of", { pageIndex: table.getState().pagination.pageIndex + 1, pageCount: table.getPageCount() })}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">{t("go-to-first-page")}</span>
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">{t("go-to-previous-page")}</span>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">{t("go-to-next-page")}</span>
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">{t("go-to-last-page")}</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
