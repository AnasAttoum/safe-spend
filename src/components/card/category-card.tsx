import Link from "next/link";
import WaveIcon from "../icon/lib/wave-icon";

type Props = {
  category: { id: string; name: string; icon: string };
};

export default function CategoryCard({ category }: Props) {
  const { id = "", icon = "", name = "" } = category;
  return (
    <Link href={{ pathname: '/', query: { categoryId: id } }} scroll={true} className="relative cardBg rounded-sm transition-all duration-300 group hover:scale-101 hover:-translate-y-1">
      <WaveIcon className="absolute -left-10 w-full rotate-90" size={100} />
      <div className="flex items-center gap-3 p-5 text-safeSpend-primary font-bold">
        <span className="text-6xl shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:rotate-12">{icon}</span>
        <span className="truncate w-full">{name}</span>
      </div>
    </Link>
  );
}
