import { TransactionDialog } from "@/components/dialog/transaction-dialog";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { cn } from "@/lib/utils";
import { Plus, Sparkles, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  dateRange: { from: Date; to: Date };
  setDateRange: (val: { from: Date; to: Date }) => void;
  currency: string;
  category: boolean
};

export default function Head({ dateRange, setDateRange, currency, category }: Props) {
  const t = useTranslations("transaction");

  return (
    <>
      <div className={cn("flex justify-between flex-wrap gap-2 py-3", category && "p-5")}>
        <h3 className="text-3xl">{t("transactions")}</h3>

        <DateRangePicker
          initialDateFrom={dateRange.from}
          initialDateTo={dateRange.to}
          showCompare={false}
          onUpdate={(values) => {
            const { from, to } = values.range;
            if (!from || !to) return;
            setDateRange({ from, to });
          }}
        />
      </div>
      {!category && <div className="flex justify-end mb-3">
        <div className="flex flex-wrap gap-3">
          <TransactionDialog
            trigger={
              <Button variant="outline" className="incomeBtn flex-1 flex">
                <Plus className="w-4 h-4" />
                {t("new-income")}
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
                {t("new-expense")}
                <Zap className="w-4 h-4" />
              </Button>
            }
            type="expense"
            currency={currency}
          />
        </div>
      </div>}
    </>
  );
}
