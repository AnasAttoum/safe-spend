import { Category } from "@/generated/prisma";
import React from "react";

type Props = {
  category: Category;
};

export default function CategoryRow({ category }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span role="img">{category.icon}</span>
      <span>{category.name}</span>
    </div>
  );
}
