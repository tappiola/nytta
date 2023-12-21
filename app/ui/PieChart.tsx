import React from "react";
import { Chart } from "primereact/chart";
import { Card } from "primereact/card";
import { Dataset } from "@/app/insights/geo/page";
import myConfig from "@/tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";

const tailwindConfig = resolveConfig(myConfig);

const PieChart = ({ name, dataset }: { name: string; dataset: Dataset }) => {
  const chartOptions = {
    cutout: "60%",
    aspectRatio: 3 / 2,
    plugins: {
      legend: {
        position: "left",
        maxWidth: 300,
        labels: {
          color: tailwindConfig.theme.colors.gray["300"],
          font: { size: 14 },
        },
      },
    },
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
    <Card className="grow items-center justify-center">
      <h2 className="m-0">{name}</h2>
      <Chart
        type="doughnut"
        data={getChartData(dataset)}
        options={chartOptions}
        className="w-96 mx-auto"
      />
    </Card>
  );
};

export default PieChart;
