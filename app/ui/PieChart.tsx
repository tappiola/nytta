"use client";
import React from "react";
import { Chart } from "primereact/chart";
import { Amenity, Categories } from "@/app/ui/types";
import { countBy, filter, size } from "lodash";
import { createTree, extractIdsFromTree, TreeNode } from "@/app/lib/util";
import { Card } from "primereact/card";

type Dataset = { [key: string]: number };

const PieChart = ({
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

  const chartOptions = {
    cutout: "60%",
  };

  const getChartData = (dataset: Dataset) => ({
    labels: Object.keys(dataset),
    datasets: [
      {
        data: Object.values(dataset),
      },
    ],
  });

  return (
    <div className="card flex flex-wrap gap-3">
      {datasets.map(({ name, dataset }, i) => (
        <Card key={i} className="w-3">
          <h1>{name}</h1>
          <Chart
            type="doughnut"
            data={getChartData(dataset)}
            options={chartOptions}
          />
        </Card>
      ))}
    </div>
  );
};

export default PieChart;
