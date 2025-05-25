import { deleteCategory } from "@/actions/category";
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

type Props = { item: string; trigger: ReactNode; id: string };

export function DeleteDialog({ item, trigger, id }: Props) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success("Category deleted successfully", { id });
      queryClient.invalidateQueries({
        queryKey: ["category"],
      });
    },
    onError: () => {
      toast.success("Something went wrong", { id });
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
              toast.loading("Deleting category...", { id });
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
