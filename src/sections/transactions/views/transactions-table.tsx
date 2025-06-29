import { getTransactionsHistoryDataResponseType } from "@/app/api/transactions/route";
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

type Props = { from: Date; to: Date };

const emptyData: any[] = [];

export default function TransactionsTable({ from, to }: Props) {
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
        {categoriesOptions.length > 1 && table.getColumn("category") && (
          <DataTableFacetedFilter
            title="Category"
            column={table.getColumn("category")}
            options={categoriesOptions}
          />
        )}
        {(data?.length ?? 0) > 1 && table.getColumn("type") && (
          <DataTableFacetedFilter
            title="Type"
            column={table.getColumn("type")}
            options={[
              { label: "Income", value: "income" },
              { label: "Expence", value: "expense" },
            ]}
          />
        )}

        {(data?.length ?? 0) > 1 && <Input
          placeholder="Search..."
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


