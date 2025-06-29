import { ExchangeDialog } from "@/components/dialog/exchange-dialog";
import { TransactionDialog } from "@/components/dialog/transaction-dialog";
import Icon from "@/components/icon/icon";
import ExchangeIcon from "@/components/icon/lib/exchange-icon";
import SmileIcon from "@/components/icon/lib/smile-icon";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, Zap } from "lucide-react";

type Props = {
  name: string;
  currency: string;
};

export default function Head({ name, currency }: Props) {
  return (
    <div className="text-3xl flex flex-wrap justify-between gap-3 items-center border-b bg-card px-5 py-2">
      <div className="flex gap-3 items-center">
        Hi, <strong>{name}!</strong> <SmileIcon size={50}/>
      </div>

      <div className="flex flex-wrap gap-3">
        <ExchangeDialog
          trigger={
            <Button variant="outline">
              <ExchangeIcon />
            </Button>
          }
          currency={currency}
        />

        <TransactionDialog
          trigger={
            <Button variant="outline" className="incomeBtn flex-1 flex">
              <Plus className="w-4 h-4" />
              New Income
              <Sparkles className="w-4 h-4" />
            </Button>
          }
          type="income"
          currency={currency}
        />

        <TransactionDialog
          trigger={
            <Button variant="outline" className="expenseBtn flex-1">
              <Plus className="w-5 h-5" />
              New expense
              <Zap className="w-4 h-4" />
            </Button>
          }
          type="expense"
          currency={currency}
        />
      </div>
    </div>
  );
}
