import Link from "next/link";
import WaveIcon from "../icon/lib/wave-icon";
import { TypedCategoriesType } from "@/actions/category";

type Props = {
  category: TypedCategoriesType["income"][number];
};

export default function CategoryCard({ category }: Props) {
  const { id = "", icon = "", name = "", _count: { transactions } } = category;
  return (
    <Link href={{ pathname: '/', query: { categoryId: id } }} scroll={true} className="relative cardBg rounded-sm transition-all duration-300 group hover:scale-101 hover:-translate-y-1">
      <WaveIcon className="absolute -left-10 w-full rotate-90" size={100} />
      <div className="flex items-center gap-3 p-5">
        <span className="text-6xl shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:rotate-12">{icon}</span>
        <div className="truncate w-full flex flex-col">
          <span className="text-safeSpend-primary font-bold w-full truncate">{name}</span>
          <small className="text-gray-500">({transactions} Transaction{transactions > 1 && "s"})</small>
        </div>
      </div>
    </Link>
  );
}
