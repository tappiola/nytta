import React from "react";
import { Amenity, Categories } from "@/app/ui/types";
import { countBy, filter, omitBy, pickBy } from "lodash";
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

  const datasetsConfig = [
    { field: "neighborhood", name: "Neighborhood" },
    { field: "locality", name: "Borough" },
    { field: "place", name: "City" },
    { field: "district", name: "Region" },
  ];

  console.log(amenities);

  const datasets: { name: string; dataset: Dataset }[] = datasetsConfig.map(
    ({ name, field }) => {
      const dataset = countBy(
        omitBy(amenities, (a) => !a[field]),
        // pickBy(amenities, ({ neighborhood }) => neighborhood),
        field,
      );

      return { name, dataset };
    },
  );
  // datasets.push({ name: "Neighborhood", dataset: g });

  return (
    <div className="card flex flex-wrap gap-3">
      {datasets.map(({ name, dataset }, i) => (
        <PieChart key={i} name={name} dataset={dataset} />
      ))}
    </div>
  );
};

export default CategoryCharts;
