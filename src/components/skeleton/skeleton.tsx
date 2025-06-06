import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  isLoading: boolean;
};

export default function SkeletonWrapper({ children, isLoading }: Props) {
  if (!isLoading) return children;
  return (
    <Skeleton>
      <div className="opacity-0">{children}</div>
    </Skeleton>
  );
}
