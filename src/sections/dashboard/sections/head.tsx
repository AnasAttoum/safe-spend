import { TransactionDialog } from "@/components/dialog/transaction-dialog";
import Icon from "@/components/icon/icon";
import { Button } from "@/components/ui/button";

type Props = {
  name: string;
  currency: string;
};

export default function Head({ name, currency }: Props) {
  return (
    <div className="text-3xl flex flex-wrap justify-between gap-3 items-center border-b bg-card px-5 py-2">
      <div className="flex gap-3 items-center">
        Hi, <strong>{name}!</strong> <Icon icon="smile" size={50} />
      </div>

      <div className="flex flex-wrap gap-3">
        <TransactionDialog
          trigger={
            <Button variant="outline" className="incomeBtn flex-1">
              New Income
              <Icon icon="income" />
            </Button>
          }
          type="income"
          currency={currency}
          />

        <TransactionDialog
          trigger={
            <Button variant="outline" className="expenseBtn flex-1">
              New expense
              <Icon icon="expense" />
            </Button>
          }
          type="expense"
          currency={currency}
          />
      </div>
    </div>
  );
}
