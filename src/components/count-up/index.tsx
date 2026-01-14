"use client";

import CountUp from "react-countup";

export default function Count({ num }: { num: number }) {
  return (
    <CountUp end={num} decimals={Number.isInteger(num) ? 0 : 2} />
  );
}
