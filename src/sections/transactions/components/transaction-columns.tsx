import { getTransactionsHistoryDataResponseType } from "@/app/[locale]/api/transactions/route";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
} from "@tanstack/react-table";
import { RowActions } from "./row-actions";

export const columns: ColumnDef<getTransactionsHistoryDataResponseType[0]>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    filterFn: (row, _id, value) => {
      const title = row.original.title?.toLowerCase() || "";
      const category = row.original.Category?.name?.toLowerCase() || "";
      return (
        title.includes(value.toLowerCase()) ||
        category.includes(value.toLowerCase())
      );
    },
    cell: ({ row }) => <div className="flex-1">{row.original.title}</div>,
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
          "text-white text-center p-2 rounded capitalize flex-1",
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
    accessorFn: (row) => row.Category.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    cell: ({ row }) => (
      <div>
        {row.original.Category.icon} {row.original.Category.name}
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