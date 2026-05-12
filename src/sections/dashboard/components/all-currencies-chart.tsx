"use client"

import { getHistoryAllCurrenciesResponseType } from "@/app/[locale]/api/history/all-currencies/route";
import SelectSpecificCurrencies from "@/components/select/select-specific-currencies";
import SkeletonWrapper from "@/components/skeleton/skeleton";
import { Card } from "@/components/ui/card";
import { currencies, defaultCurrency } from "@/config/currencies";
import { queryKey } from "@/config/query-key";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function AllCurrenciesChart() {

  const { data, isLoading } = useQuery<getHistoryAllCurrenciesResponseType>({
    queryKey: [queryKey.overview, queryKey.history],
    queryFn: () =>
      fetch(
        `/api/history/all-currencies`
      ).then((res) => res.json()),
  });
  const [visibleCurrencies, setVisibleCurrencies] = useState([defaultCurrency.value]);

  useEffect(() => {
    if (!data) return;

    const nonZeroCurrencies = data?.uniqeCurrencies?.filter((curr) => !!data?.allCurrenciesBalance[data?.allCurrenciesBalance.length - 1]?.[curr])
    setVisibleCurrencies(nonZeroCurrencies ?? [])
  }, [data, setVisibleCurrencies])

  return (
    <SkeletonWrapper isLoading={isLoading}>
      <Card className="p-5 h-150 w-full">
        {data?.allCurrenciesBalance.length && data?.uniqeCurrencies.length
          ?
          <>
            <SelectSpecificCurrencies
              selected={visibleCurrencies}
              onSelect={(newValue) => setVisibleCurrencies(newValue)}
              myCurrencies={data?.uniqeCurrencies}
            />
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.allCurrenciesBalance}>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {

                      const point = payload[0].payload;
                      const date = new Date(point.year, point.month);

                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">

                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                              <span className="font-bold">
                                {date.toLocaleDateString("default", {
                                  year: "numeric",
                                  month: "long",
                                })}
                              </span>
                            </div>

                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">Value</span>
                              {visibleCurrencies.map((currency) => {
                                const color = currencies.find((({ value }) => value === currency))?.color
                                return <span key={currency} className="flex justify-between gap-2 font-bold" style={{ color }}>
                                  <CountUp
                                    duration={0.5}
                                    end={point?.[currency]}
                                    preserveValue
                                    decimals={Number.isInteger(point?.[currency]) ? 0 : 2}
                                    className='font-bold'
                                  />
                                  <span>{currency}</span>
                                </span>
                              })}
                              {/* <span className="font-bold text-[#ff6b00]">{payload[0].payload.value2}</span> */}
                            </div>

                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                {visibleCurrencies.map((currency: string) =>
                  <YAxis key={currency} yAxisId={currency} interval="preserveStartEnd"
                    tickFormatter={(value) =>
                      value >= 1_000_000_000
                        ? `${(value / 1_000_000_000).toFixed(1)}B`
                        :
                        value >= 1_000_000
                          ? `${(value / 1_000_000).toFixed(1)}M`
                          : value >= 1_000
                            ? `${(value / 1_000).toFixed(1)}K`
                            : value
                    }
                    tick={{ fill: currencies.find(({ value }) => value === currency)?.color || 'black' }} // color of tick labels
                    axisLine={{ stroke: currencies.find(({ value }) => value === currency)?.color || 'black' }} // color of axis line
                    tickLine={{ stroke: currencies.find(({ value }) => value === currency)?.color || 'black' }} // color of tick lines
                  />
                )}
                <XAxis
                  stroke="#888"
                  fontSize={12}
                  dataKey={(data) => {
                    const { year, month, day = 1 } = data;
                    const date = new Date(year, month, day);
                    return date.toLocaleDateString("default", {
                      year: "numeric",
                      month: "long",
                    });
                  }}
                  angle={-10}
                />
                {visibleCurrencies.map((currency: string) =>
                  <Line key={currency} yAxisId={currency} type="monotone" dataKey={currency} stroke={currencies.find((({ value }) => value === currency))?.color} strokeWidth={2} dot={false} />
                )}
                {/* <Line type="monotone" dataKey="value2" stroke="#ff6b00" strokeWidth={2} dot={false} /> */}
              </LineChart>
            </ResponsiveContainer>
          </>
          : <div className="flex flex-col justify-center items-center h-full">
            <div>No data found</div>
            <p className="text-gray-500">
              Try add transactions
            </p>
          </div>}
      </Card>
    </SkeletonWrapper >
  )
}