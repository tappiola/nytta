"use client";
import React from "react";
import { Chart } from "primereact/chart";
import { Amenity, Categories } from "@/app/ui/types";
import { countBy, filter, size } from "lodash";
import { createTree, extractIdsFromTree, TreeNode } from "@/app/lib/util";

const PieChart = ({
  amenities,
  categories,
}: {
  amenities: Amenity[];
  categories: Categories;
}) => {
  const categoriesTree = createTree(categories);
  const groupedAmenities = countBy(amenities, "amenity.name");
  const groupedByParent = countBy(amenities, "amenity.parentId");
  const datasets = [];

  const getCount = (tree: TreeNode[]) => {
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

    if (Object.keys(r).length) {
      datasets.push(r);
    }

    tree.forEach((c) => {
      if (c.children) {
        getCount(c.children);
      }
    });
  };

  getCount(categoriesTree);
  console.log(datasets);

  const chartOptions = {
    cutout: "60%",
  };

  const getchartData = (dataset) => ({
    labels: Object.keys(dataset),
    datasets: [
      {
        data: Object.values(dataset),
      },
    ],
  });

  return (
    <div className="card flex justify-content-center">
      {datasets.map((d) => (
        <Chart
          type="doughnut"
          data={getchartData(d)}
          options={chartOptions}
          className="w-full md:w-30rem"
        />
      ))}
    </div>
  );
};

export default PieChart;
