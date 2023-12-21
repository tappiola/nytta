import React from "react";
import { filter, size } from "lodash";
import { createTree, extractIdsFromTree, TreeNode } from "@/app/lib/util";
import PieChart from "@/app/ui/PieChart";
import { getAmenitiesData, getCategories } from "@/app/lib/actions";

export type Dataset = { [key: string]: number };

const Page = async () => {
  const amenities = await getAmenitiesData();
  const categories = await getCategories();

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

  getCount("All Spheres", categoriesTree);

  return (
    <div className="grid grid-cols-3 gap-3 m-4">
      {datasets.map(({ name, dataset }, i) => (
        <PieChart key={i} name={name} dataset={dataset} />
      ))}
    </div>
  );
};

export default Page;
