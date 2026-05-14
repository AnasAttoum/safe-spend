"use client";

import { getTransactionsHistoryDataResponseType } from "@/app/[locale]/api/transactions/route";
import { TransactionDialog } from "@/components/dialog/transaction-dialog";
import { Button } from "@/components/ui/button";
import { queryKey } from "@/config/query-key";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { BookmarkIcon } from "lucide-react";

export default function Bookmarks() {
  const { data } = useQuery<getTransactionsHistoryDataResponseType>({
    queryKey: [queryKey.transaction, queryKey.bookmark],
    queryFn: () =>
      fetch(
        `/api/bookmarks`
      ).then((res) => res.json()),
  });

  return (
    <div className="flex flex-wrap gap-3 overflow-hidden">
      {!!data?.length && data.map((bookmark) => <TransactionDialog
        key={bookmark.id}
        trigger={
          <Button variant="outline" className={cn("mt-3 max-w-full h-auto", bookmark.type === "income" ? "border border-income!" : "border border-expense!")}>
            <BookmarkIcon className={bookmark.type === "income" ? "fill-income text-income" : "fill-expense text-expense"} />
            <span className="whitespace-normal text-start">{bookmark.title}</span>
          </Button>
        }
        type={bookmark.type as "income" | "expense"}
        transaction={bookmark}
        isBookmark
      />)}
    </div>
  );
}
