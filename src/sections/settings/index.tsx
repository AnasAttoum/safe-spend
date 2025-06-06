import { DeleteMyDataDialog } from "@/components/dialog/delete-my-data-dialog";
import CategoryList from "./views/category-list";
import Currency from "./views/currency";

export default function Settings() {
  return (
    <>
      <div className="py-3">
        <h3 className="text-3xl">Settings</h3>
        <p className="text-sm text-gray-500">
          Manage your account settings and categories
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-3">
        <Currency />
        <CategoryList type="income" />
        <CategoryList type="expense" />
      </div>

      <DeleteMyDataDialog />

    </>
  );
}
