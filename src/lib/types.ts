export type Timeframe = "month" | "year";

export type Period = { month: number; year: number };

export type HistoryData = {
  month: number;
  year: number;
  day?: number;
  income: number;
  expense: number;
};
