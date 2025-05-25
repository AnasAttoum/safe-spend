import { DeleteDialog } from "../dialog/delete-dialog";
import Icon from "../icon/icon";
import { Button } from "../ui/button";

type Props = {
  category: { id: string; name: string; icon: string };
};

export default function CategoryCard({ category }: Props) {
  const { id = "", icon = "", name = "" } = category;
  return (
    <div className="bg-gray-300 text-black rounded-lg">
      <div className="p-5">
        {icon} {name}
      </div>

      <DeleteDialog
        item="category"
        id={id}
        trigger={
          <Button className="w-full cursor-pointer rounded-t-none bg-red-50 hover:bg-red-100">
            <Icon icon="trash" />
            Delete
          </Button>
        }
      />
    </div>
  );
}
