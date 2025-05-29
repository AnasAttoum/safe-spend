import { getTransactionsHistoryDataResponseType } from "@/app/api/history/transactions/route";
import DataTable from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { DataTableViewOptions } from "@/components/data-table/column-toggle";
import { DataTableFacetedFilter } from "@/components/data-table/faceted-filters";
import { DeleteDialog } from "@/components/dialog/delete-dialog";
import Icon from "@/components/icon/icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { dateToUTCDate } from "@/lib/date-helper";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

type Props = { from: Date; to: Date };

const emptyData: any[] = [];

export default function TransactionsTable({ from, to }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data, isLoading } = useQuery<getTransactionsHistoryDataResponseType>({
    queryKey: ["transaction", "history", from, to],
    queryFn: () =>
      fetch(
        `/api/history/transactions?from=${dateToUTCDate(
          from
        )}&to=${dateToUTCDate(to)}`
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
    data?.forEach(({ category, categoryIcon }) => {
      const key = category;
      if (!seen.has(key)) {
        seen.set(key, {
          label: `${categoryIcon} ${category}`,
          value: category,
        });
      }
    });
    return Array.from(seen.values());
  }, [data]);

  return (
    <>
      <div className="flex gap-2 mb-2">
        {categoriesOptions.length > 1 && table.getColumn("category") && (
          <DataTableFacetedFilter
            title="Category"
            column={table.getColumn("category")}
            options={categoriesOptions}
          />
        )}
        {data?.length && data.length > 1 && table.getColumn("type") && (
          <DataTableFacetedFilter
            title="Type"
            column={table.getColumn("type")}
            options={[
              { label: "Income", value: "income" },
              { label: "Expence", value: "expense" },
            ]}
          />
        )}

        <DataTableViewOptions table={table} />
      </div>
      <DataTable
        isFetching={isLoading}
        table={table}
        columnsLength={columns.length}
      />
    </>
  );
}

export const columns: ColumnDef<getTransactionsHistoryDataResponseType[0]>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => row.original.title,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    cell: ({ row }) => (
      <div
        className={cn(
          "text-center p-2 rounded capitalize",
          row.original.type === "income" && "bg-income",
          row.original.type === "expense" && "bg-expense"
        )}
      >
        {row.original.type}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    cell: ({ row }) => (
      <div>
        {row.original.categoryIcon} {row.original.category}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => row.original.amount,
  },
  {
    accessorKey: "currency",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Currency" />
    ),
    cell: ({ row }) => row.original.currency,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      return date.toLocaleDateString("default", {
        timeZone: "UTC",
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    },
  },
  {
    accessorKey: "Actions",
    enableHiding: false,
    cell: ({ row }) => <RowActions transaction={row.original} />,
  },
];

const RowActions = ({
  transaction,
}: {
  transaction: getTransactionsHistoryDataResponseType[0];
}) => {
  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Icon icon="more" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem onSelect={() => setOpena(false)}> */}
          <DeleteDialog
            item="transaction"
            id={transaction.id}
            trigger={
              <Button variant="ghost" className="w-full text-start">
                <Icon icon="trash" />
                Delete
              </Button>
            }
          />
        {/* </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
