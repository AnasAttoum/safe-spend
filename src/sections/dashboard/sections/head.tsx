import Icon from "@/components/icon/icon";
import { Button } from "@/components/ui/button";

type Props = {
  name: string;
};

export default function Head({ name }: Props) {
  return (
    <div className="text-3xl flex flex-wrap justify-between gap-3 items-center border-b bg-card px-5 py-2">
      <div className="flex gap-3 items-center">
        Hi, <strong>{name}!</strong> <Icon icon="smile" size={50} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" className="incomeBtn flex-1">
          New Income
          <Icon icon="income" />
        </Button>
        <Button variant="outline" className="expenseBtn flex-1">
          New expense
          <Icon icon="expense" />
        </Button>
      </div>
    </div>
  );
}
