"use client";
import { Dispatch, SetStateAction } from "react";
import { getCategories } from "@/app/lib/actions";
import { Prisma } from "@prisma/client";
import { Tree, TreeCheckboxSelectionKeys } from "primereact/tree";
import { createTree } from "@/app/lib/util";

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
  const data = createTree(categories);

  return (
    <Tree
      value={data}
      selectionMode="checkbox"
      selectionKeys={selectedCategories}
      onSelectionChange={(e) =>
        setSelectedCategories(e.value as TreeCheckboxSelectionKeys)
      }
      className="w-full md:w-30rem overflow-y-auto"
      filter
      filterMode="lenient"
      filterPlaceholder="Filter amenities"
      style={{
        borderRadius: 0,
        borderBlock: "none",
        borderInlineStart: "none",
      }}
    />
  );
};

export default CategorySelect;
