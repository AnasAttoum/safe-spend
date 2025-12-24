import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SkeletonWrapper from "../skeleton/skeleton";
import { flexRender, Table as TableType } from "@tanstack/react-table";
import { DataTablePagination } from "./pagination";

export default function DataTable({
  isLoading,
  table,
  columnsLength,
}: {
  isLoading: boolean;
  table: TableType<any>;
  columnsLength: number;
}) {
  return (
    <div className="rounded-md border">
      <SkeletonWrapper isLoading={isLoading}>
        <Table>
          <TableHeader className="bg-safeSpend-secondary h-14">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="aria-[sort]:bg-safeSpend-secondary hover:bg-safeSpend-secondar">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="aria-[sort]:bg-safeSpend-secondary">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.getValue() !== "" ? flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      ) : '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnsLength}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <DataTablePagination table={table} />
      </SkeletonWrapper>
    </div>
  );
}
