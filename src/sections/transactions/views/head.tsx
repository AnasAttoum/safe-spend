import { TransactionDialog } from "@/components/dialog/transaction-dialog";
import Icon from "@/components/icon/icon";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";

type Props = {
  dateRange: { from: Date; to: Date };
  setDateRange: (val: { from: Date; to: Date }) => void;
  currency: string;
};

export default function Head({ dateRange, setDateRange, currency }: Props) {
  return (
    <>
      <div className="flex justify-between flex-wrap gap-2 py-3">
        <h3 className="text-3xl">Transactions</h3>

        <DateRangePicker
          initialDateFrom={dateRange.from}
          initialDateTo={dateRange.to}
          showCompare={false}
          onUpdate={(values) => {
            const { from, to } = values.range;
            console.log("🚀 ~ Head ~ values.range:", values.range)
            if (!from || !to) return;
            setDateRange({ from, to });
          }}
        />
      </div>
      <div className="flex justify-end mb-3">
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
    </>
  );
}
