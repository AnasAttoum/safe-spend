import { Link } from "@/lib/localization/navigation";
import Image from "next/image";

export default function Logo({
  size = 50,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Link href="/" className={className}>
      <Image
        src="/assets/safeSpend.svg"
        alt="Safe Spend Logo"
        width={size}
        height={size}
      />
    </Link>
  );
}
