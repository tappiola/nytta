import React from "react";
import { Amenity } from "@/app/ui/types";
import { countBy, omitBy } from "lodash";
import PieChart from "@/app/ui/PieChart";
import { getAmenitiesData } from "@/app/lib/actions";

export type Dataset = { [key: string]: number };

const CategoryCharts = async () => {
  const amenities = await getAmenitiesData();

  const datasetsConfig: { field: keyof Amenity; name: string }[] = [
    { field: "neighborhood", name: "Neighborhood" },
    { field: "locality", name: "Borough" },
    { field: "place", name: "City" },
    { field: "district", name: "Region" },
  ];

  const datasets: { name: string; dataset: Dataset }[] = datasetsConfig.map(
    ({ name, field }) => {
      const dataset = countBy(
        omitBy(amenities, (a) => !a[field]),
        field,
      );

      return { name, dataset };
    },
  );

  return (
    <div className="card grid grid-cols-3 gap-3 m-3">
      {datasets.map(({ name, dataset }, i) => (
        <PieChart key={i} name={name} dataset={dataset} />
      ))}
    </div>
  );
};

export default CategoryCharts;
