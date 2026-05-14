import { getTransactionsHistoryDataResponseType } from "@/app/[locale]/api/transactions/route";
import DataTable from "@/components/data-table";
import { DataTableViewOptions } from "@/components/data-table/column-toggle";
import { DataTableFacetedFilter } from "@/components/data-table/faceted-filters";
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
import { useMemo, useState } from "react";
import { columns } from "../components/transaction-columns";
import { CategoryOverview } from "@/sections/dashboard";
import { useTranslations } from "next-intl";

type Props = { from: Date; to: Date; categoryOverview?: CategoryOverview };

const emptyData: any[] = [];

export default function TransactionsTable({ from, to, categoryOverview }: Props) {
  const t = useTranslations();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { fromUTC, toUTC } = getUTCRange(from, to);
  const { data, isLoading } = useQuery<getTransactionsHistoryDataResponseType>({
    queryKey: [queryKey.transaction, queryKey.history, from, to],
    queryFn: () =>
      fetch(
        `/api/transactions?from=${fromUTC.toISOString()}&to=${toUTC.toISOString()}`
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

  const categoriesOptions: {
    label: string;
    value: string;
  }[] = useMemo(() => {
    const seen = new Map();
    data?.forEach(({ Category: { icon, name } }) => {
      const key = name;
      if (!seen.has(key)) {
        seen.set(key, {
          label: `${icon} ${name}`,
          value: name,
        });
      }
    });
    return Array.from(seen.values());
  }, [data]);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-2">
        {!!categoriesOptions.length && table.getColumn("category") && (
          <DataTableFacetedFilter
            title="category.Category"
            column={table.getColumn("category")}
            options={categoriesOptions}
            fixedValue={categoryOverview?.category.name}
            fixedIcon={categoryOverview?.category.icon}
          />
        )}
        {!!data?.length && table.getColumn("type") && (
          <DataTableFacetedFilter
            title="type"
            column={table.getColumn("type")}
            options={[
              { label: "Income", value: t("transaction.income") },
              { label: "Expence", value: t("transaction.expense") },
            ]}
            fixedValue={categoryOverview?.category.type}
          />
        )}

        {(data?.length ?? 0) > 1 && <Input
          placeholder={t("search")}
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(transaction) =>
            table.getColumn("title")?.setFilterValue(transaction.target.value)
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


