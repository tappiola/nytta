import React from "react";
import { Amenity, Categories } from "@/app/ui/types";
import { filter, size } from "lodash";
import { createTree, extractIdsFromTree, TreeNode } from "@/app/lib/util";
import PieChart from "@/app/ui/PieChart";

export type Dataset = { [key: string]: number };

const CategoryCharts = ({
  amenities,
  categories,
}: {
  amenities: Amenity[];
  categories: Categories;
}) => {
  const categoriesTree = createTree(categories);
  const datasets: { name: string; dataset: Dataset }[] = [];

  const getCount = (name: string, tree: TreeNode[]) => {
    const r = tree.reduce((prev, c) => {
      const ids = extractIdsFromTree(c);
      const newSize = size(
        filter(amenities, (a) => ids.includes(a.amenity.id)),
      );

      return newSize
        ? {
            ...prev,
            [c.name]: size(
              filter(amenities, (a) => ids.includes(a.amenity.id)),
            ),
          }
        : prev;
    }, {});

    if (Object.keys(r).length > 1) {
      datasets.push({ name, dataset: r });
    }

    tree.forEach((c) => {
      if (c.children) {
        getCount(c.name, c.children);
      }
    });
  };

  getCount("All Categories", categoriesTree);

  return (
    <div className="card flex flex-wrap gap-3">
      {datasets.map(({ name, dataset }, i) => (
        <PieChart key={i} name={name} dataset={dataset} />
      ))}
    </div>
  );
};

export default CategoryCharts;
