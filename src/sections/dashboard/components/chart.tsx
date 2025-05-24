import { getHistoryDataResponseType } from "@/app/api/history/data/route";
import { Timeframe } from "@/lib/types";
import { cn } from "@/lib/utils";
import React from "react";
import CountUp from "react-countup";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  // Legend,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: getHistoryDataResponseType;
  timeframe: Timeframe;
};

const incomeColor = "var(--income)",
  incomeDarkColor = "var(--income-dark)",
  expenseColor = "var(--expense)",
  expenseDarkColor = "var(--expense-dark)";

export default function Chart({ data, timeframe }: Props) {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          {/* <defs>
            <linearGradient id="incomeBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#40916c" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff4d6d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#c9184a" stopOpacity={0} />
            </linearGradient>
          </defs> */}
          <CartesianGrid strokeDasharray="5 5" vertical={false} />
          <XAxis
            stroke="#888"
            fontSize={12}
            dataKey={(data) => {
              const { year, month, day = 1 } = data;
              const date = new Date(year, month, day);
              if (timeframe === "year") {
                return date.toLocaleDateString("default", {
                  month: "long",
                });
              }
              return date.toLocaleDateString("default", {
                day: "2-digit",
              });
            }}
          />
          <YAxis stroke="#888" fontSize={12} />
          <Tooltip
            cursor={{ opacity: 0.1 }}
            content={(props) => <CustomTooltip {...props} />}
          />
          {/* <Legend /> */}
          <Bar
            dataKey="income"
            // fill="url(#incomeBar)"
            fill={incomeColor}
            activeBar={
              <Rectangle fill={incomeDarkColor} stroke={incomeDarkColor} />
            }
            radius={3}
          />
          <Bar
            dataKey="expense"
            fill={expenseColor}
            activeBar={<Rectangle fill={expenseDarkColor} stroke={expenseDarkColor} />}
            radius={3}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const { income, expense } = data;

  return (
    <div className="min-w-[300px] rounded bg-background p-4">
      <TooltipRow
        label="Income"
        value={income}
        bgColor="bg-income"
        textColor="text-income"
      />
      <TooltipRow
        label="Expense"
        value={expense}
        bgColor="bg-expense"
        textColor="text-expense"
      />
      <TooltipRow
        label="Balance"
        value={income - expense}
        bgColor="bg-blue-primary"
        textColor="text-blue-primary"
      />
    </div>
  );
};

const TooltipRow = ({
  label,
  value,
  bgColor,
  textColor,
}: {
  label: string;
  value: number;
  bgColor: string;
  textColor: string;
}) => (
  <div className="flex items-center gap-2">
    <div className={cn("w-4 h-4 rounded-full", bgColor)} />
    <div className="flex justify-between w-full text-sm">
      <p>{label}</p>
      <CountUp
        duration={0.5}
        end={value}
        preserveValue
        decimals={0}
        className={textColor}
      />
    </div>
  </div>
);
