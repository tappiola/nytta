"use client";
import { Dispatch, SetStateAction } from "react";
import { getCategories } from "@/app/lib/actions";
import { Prisma } from "@prisma/client";
import { Tree, TreeCheckboxSelectionKeys } from "primereact/tree";

type Categories = Prisma.PromiseReturnType<typeof getCategories>;
const CategorySelect = ({
  selectedCategories,
  setSelectedCategories,
  categories,
}: {
  categories: Categories;
  selectedCategories: TreeCheckboxSelectionKeys;
  setSelectedCategories: Dispatch<SetStateAction<TreeCheckboxSelectionKeys>>;
}) => {
  const d3 = categories.map((c) => ({
    key: c.id,
    label: c.name,
    children: c.categories.map((item) => ({
      key: `${c.id}-${item.id}`,
      label: item.name,
      children: item.SubCategory.map((sub) => ({
        key: `${c.id}-${item.id}-${sub.id}`,
        label: sub.name,
      })),
    })),
  }));

  return (
    <Tree
      value={d3}
      selectionMode="checkbox"
      selectionKeys={selectedCategories}
      onSelectionChange={(e) =>
        setSelectedCategories(e.value as TreeCheckboxSelectionKeys)
      }
      className="w-full md:w-30rem overflow-y-auto"
      filter
      filterMode="lenient"
      filterPlaceholder="Filter categories"
    />
  );
};

export default CategorySelect;
