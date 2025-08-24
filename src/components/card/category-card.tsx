import Link from "next/link";
import WaveIcon from "../icon/lib/wave-icon";

type Props = {
  category: { id: string; name: string; icon: string };
};

export default function CategoryCard({ category }: Props) {
  const { id = "", icon = "", name = "" } = category;
  return (
    <Link href={{ pathname: '/', query: { categoryId: id } }} className="relative cardBg text-black rounded-sm">
      <WaveIcon className="absolute -left-10 w-full rotate-90" size={100} />
      <div className="flex items-center gap-3 p-5 text-safeSpend-primary font-bold">
        <span className="text-6xl shrink-0">{icon}</span>
        <span className="truncate max-w-[150px]">{name}</span>
      </div>
    </Link>
  );
}
