import React from "react";
import { Card } from "../ui/card";
import Icon from "../icon/icon";
import CountUp from "react-countup";

type Props = {
  title: string;
  value: number;
  icon: string;
  locale?: string;
};

export default function CardStatistic({
  title,
  icon,
  value,
  locale = "$",
}: Props) {
  return (
    <Card>
      <div className="flex gap-3 px-5">
        <Icon icon={icon} size={40} />
        <div className="flex flex-col">
          <p className="text-gray-400">{title}</p>
          <div>
            {locale}&nbsp;
            <CountUp end={value} />
          </div>
        </div>
      </div>
    </Card>
  );
}
