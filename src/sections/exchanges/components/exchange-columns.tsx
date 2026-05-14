import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
} from "@tanstack/react-table";
import { getExchangesHistoryDataResponseType } from "@/app/[locale]/api/exchanges/route";
import { RowActions } from "./row-actions";
import CountUp from "react-countup";

export const columns: ColumnDef<getExchangesHistoryDataResponseType[0]>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="labels.title" />
    ),
    filterFn: (row, _id, value) => {
      const title = row.original.title?.toLowerCase() || "";
      return title.includes(value.toLowerCase())
    },
    cell: ({ row }) => <div className="flex-1">{row.original.title}</div>,
  },
  {
    accessorKey: "exchangeAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="exchange.exchange-amount" />
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    cell: ({ row }) => (
      <div
        className={cn(
          "text-white text-center p-2 rounded capitalize flex-1 bg-expense",
        )}
      >
        <CountUp
          end={row.original.exchangeAmount}
          decimals={Number.isInteger(row.original.exchangeAmount) ? 0 : 2}
        />
        &nbsp;{row.original.exchangeCurrency}
      </div>
    ),
  },
  {
    accessorKey: "collectedAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="exchange.collected-amount" />
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    cell: ({ row }) => (
      <div
        className={cn(
          "text-white text-center p-2 rounded capitalize flex-1 bg-income",
        )}
      >
        <CountUp
          end={row.original.collectedAmount}
          decimals={Number.isInteger(row.original.collectedAmount) ? 0 : 2}
        />
        &nbsp;{row.original.targetCurrency}
      </div>
    ),
  },
  {
    accessorKey: "exchangeRate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="exchange.exchange-rate" />
    ),
    cell: ({ row }) => {
      const exchangeRate = row.original.collectedAmount / row.original.exchangeAmount;
      return <div className="flex">
        <CountUp
          end={exchangeRate}
          decimals={Number.isInteger(exchangeRate) ? 0 : 2}
          className={cn(
            "text-white text-center p-2 rounded capitalize flex-1 bg-safeSpend-light ",
          )}
        />
      </div>
    },
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
    cell: ({ row }) => <RowActions exchange={row.original} />,
  },
];