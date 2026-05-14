import { getTransactionsHistoryDataResponseType } from "@/app/[locale]/api/transactions/route";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
} from "@tanstack/react-table";
import { RowActions } from "./row-actions";
import { useTranslations } from "next-intl";

const TypeCell = ({ type }: { type: string }) => {
  const t = useTranslations();

  return (
    <div
      className={cn(
        "text-white text-center p-2 rounded capitalize flex-1",
        type === "income" && "bg-income",
        type === "expense" && "bg-expense"
      )}
    >
      {t(`transaction.${type}`)}
    </div>
  );
};

export const columns: ColumnDef<getTransactionsHistoryDataResponseType[0]>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="labels.title" />
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
      <DataTableColumnHeader column={column} title="type" />
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    cell: ({ row }) => <TypeCell type={row.original.type} />,
  },
  {
    accessorKey: "category",
    accessorFn: (row) => row.Category.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="category.Category" />
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
      <DataTableColumnHeader column={column} title="labels.amount" />
    ),
    cell: ({ row }) => row.original.amount,
  },
  {
    accessorKey: "currency",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="labels.currency" />
    ),
    cell: ({ row }) => row.original.currency,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="labels.date" />
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