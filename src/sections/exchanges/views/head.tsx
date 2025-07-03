import { ExchangeDialog } from "@/components/dialog/exchange-dialog";
import ExchangeIcon from "@/components/icon/lib/exchange-icon";
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
        <h3 className="text-3xl">Exchanges</h3>

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
      <div className="flex justify-end mb-3">
        <ExchangeDialog
          trigger={
            <Button variant="default" className="primaryBtn">
              New Exchange
              <ExchangeIcon color="#fff" />
            </Button>
          }
          currency={currency}
        />
      </div>
    </>
  );
}
