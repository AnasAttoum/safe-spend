"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useState } from "react";
import { useCountDown } from "../count-down";
import { resetUserData } from "../../actions/reset-user-data";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { queryKey } from "@/config/query-key";

export function DeleteMyDataDialog() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const countDown = useCountDown(9, open)
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: async () => {
      return await resetUserData();
    },
    onSuccess: () => {
      toast.success(
        `Your data deleted successfully`,
        { id: 'delete-my-data' }
      );
      
      router.push(routes.currency);
      queryClient.invalidateQueries({
        queryKey: [queryKey.category, queryKey.history, queryKey.overview, queryKey.periods, queryKey.statistics, queryKey.transaction, queryKey.user],
      });
    },
    onError: (error) => {
      console.error("Error:", error)
      toast.error("Something went wrong", { id: 'delete-my-data' });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <div className="flex justify-end">
        <AlertDialogTrigger asChild>
          <Button className="deleteBtn">
            Delete My Data
          </Button>
        </AlertDialogTrigger>
      </div>
      <AlertDialogContent onEscapeKeyDown={() => setOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-900">Are you sure?!</AlertDialogTitle>
          <AlertDialogDescription>
            {`This action cannot be undone. This will permanently delete your data.`}
            <br />
            <strong>Warning:</strong> Thats include your categories, transactions, exchanges and your history data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="cursor-pointer uppercase text-red-900 hover:text-red-700"
            onClick={() => {
              toast.loading(`Deleting your data...`, { id: 'delete-my-data' });
              mutate();
            }}
            disabled={countDown > 0}
          >
            {countDown > 0 ? `Reset all data (${countDown})` : "Reset all data"}
          </AlertDialogCancel>
          <AlertDialogAction className="cursor-pointer">
            Cancel
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
