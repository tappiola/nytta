import React from "react";
import { filter, size } from "lodash";
import { createTree, extractIdsFromTree, TreeNode } from "@/app/lib/util";
import PieChart from "@/app/ui/analytics/PieChart";
import { getAmenitiesData, getCategories } from "@/app/lib/actions";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Dataset } from "@/app/ui/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spheres Insights| Nýtta",
};

const Page = async () => {
  const amenities = await getAmenitiesData();
  const categories = await getCategories();

  const categoriesTree = createTree(categories);
  const datasets: { name: string; dataset: Dataset }[] = [];

  const getChildrenCount = (name: string, tree: TreeNode[]) => {
    const dataset = tree.reduce((prev, treeNode) => {
      const ids = extractIdsFromTree(treeNode);
      const newSize = size(
        filter(amenities, (a) => ids.includes(a.amenity.id)),
      );

      return newSize
        ? {
            ...prev,
            [treeNode.name]: size(
              filter(amenities, (a) => ids.includes(a.amenity.id)),
            ),
          }
        : prev;
    }, {});

    if (Object.keys(dataset).length > 1) {
      datasets.push({ name, dataset });
    }

    tree.forEach(({ name, children }) => {
      if (children) {
        getChildrenCount(name, children);
      }
    });
  };

  getChildrenCount("All Spheres", categoriesTree);

  return (
    <div className="grid grid-cols-3 gap-3 m-4">
      {datasets.map(({ name, dataset }, i) => (
        <PieChart key={i} name={name} dataset={dataset} />
      ))}
    </div>
  );
};

export default withPageAuthRequired(Page, {
  returnTo: "/insights/spheres",
});
