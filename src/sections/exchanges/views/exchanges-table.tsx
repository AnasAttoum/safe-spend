import { getTransactionsHistoryDataResponseType } from "@/app/[locale]/api/transactions/route";
import DataTable from "@/components/data-table";
import { DataTableViewOptions } from "@/components/data-table/column-toggle";
import { Input } from "@/components/ui/input";
import { queryKey } from "@/config/query-key";
import { getUTCRange } from "@/lib/date-helper";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { columns } from "../components/exchange-columns";
import { useTranslations } from "next-intl";

type Props = { from: Date; to: Date };

const emptyData: any[] = [];

export default function ExchangesTable({ from, to }: Props) {
  const t = useTranslations();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { fromUTC, toUTC } = getUTCRange(from, to);
  const { data, isLoading } = useQuery<getTransactionsHistoryDataResponseType>({
    queryKey: [queryKey.exchange, queryKey.history, from, to],
    queryFn: () =>
      fetch(
        `/api/exchanges?from=${fromUTC.toISOString()}&to=${toUTC.toISOString()}`
      ).then((res) => res.json()),
  });

  const table = useReactTable({
    data: data || emptyData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-2">
        {(data?.length ?? 0) > 1 && <Input
          placeholder={t("search")}
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(exchange) =>
            table.getColumn("title")?.setFilterValue(exchange.target.value)
          }
          className="max-w-xs h-8"
        />}
        <DataTableViewOptions table={table} />
      </div>
      <DataTable
        isLoading={isLoading}
        table={table}
        columnsLength={columns.length}
      />
    </>
  );
}


