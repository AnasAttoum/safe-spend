import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  isFetching: boolean;
};

export default function SkeletonWrapper({ children, isFetching }: Props) {
  if (!isFetching) return children;
  return (
    <Skeleton>
      <div className="opacity-0">{children}</div>
    </Skeleton>
  );
}
