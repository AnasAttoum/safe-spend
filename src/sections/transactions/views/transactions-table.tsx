import { getTransactionsHistoryDataResponseType } from "@/app/api/history/transactions/route";
import DataTable from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { dateToUTCDate } from "@/lib/date-helper";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

type Props = { from: Date; to: Date };

const emptyData: any[] = [];

export default function TransactionsTable({ from, to }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { data, isFetching } = useQuery<getTransactionsHistoryDataResponseType>(
    {
      queryKey: ["transactions", "history", from, to],
      queryFn: () =>
        fetch(
          `/api/history/transactions?from=${dateToUTCDate(
            from
          )}&to=${dateToUTCDate(to)}`
        ).then((res) => res.json()),
    }
  );

  const table = useReactTable({
    data: data || emptyData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <DataTable
      isFetching={isFetching}
      table={table}
      columnsLength={columns.length}
    />
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
    cell: ({ row }) => row.original.type,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
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
];
