"use client";

import CountUp from "react-countup";

export default function Count({ num, suffix }: { num: number; suffix?: string }) {
  return (
    <CountUp end={num} decimals={Number.isInteger(num) ? 0 : 2} suffix={suffix} />
  );
}
