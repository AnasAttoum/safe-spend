import { getHistoryDataResponseType } from "@/app/api/history/data/route";
import { Timeframe } from "@/lib/types";
import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: getHistoryDataResponseType;
  timeframe: Timeframe;
};

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
          <defs>
            <linearGradient id="incomeBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#40916c" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff4d6d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#c9184a" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Tooltip />
          {/* <Legend /> */}
          <Bar
            dataKey="income"
            fill="#40916c"
            activeBar={<Rectangle fill="#2d6a4f" stroke="#2d6a4f" />}
          />
          <Bar
            dataKey="expense"
            fill="#ff4d6d"
            activeBar={<Rectangle fill="#c9184a" stroke="#c9184a" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
