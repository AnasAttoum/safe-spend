import { DateRangePicker } from "@/components/ui/date-range-picker";

type Props = {
  dateRange: { from: Date; to: Date };
  setDateRange: (val: { from: Date; to: Date }) => void;
};

export default function Head({ dateRange, setDateRange }: Props) {
  return (
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
  );
}
