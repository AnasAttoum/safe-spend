import { deleteCategory } from "@/actions/category";
import { deleteTransaction } from "@/actions/transaction";
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
import { ReactNode } from "react";
import { toast } from "sonner";

type Props = {
  item: "category" | "transaction";
  trigger: ReactNode;
  id: string;
};

export function DeleteDialog({ item, trigger, id }: Props) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (formId: string) => {
      if (item === "category") {
        return await deleteCategory(formId);
      } else {
        return await deleteTransaction(formId);
      }
    },
    onSuccess: () => {
      toast.success(
        `${item.charAt(0).toUpperCase() + item.slice(1)} deleted successfully`,
        { id }
      );
      queryClient.invalidateQueries({
        queryKey: [item],
      });
    },
    onError: () => {
      toast.error("Something went wrong", { id });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?!</AlertDialogTitle>
          <AlertDialogDescription>
            {`This action cannot be undone. This will permanently delete your ${item}.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer"
            onClick={() => {
              toast.loading(`Deleting ${item}...`, { id });
              mutate(id);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
