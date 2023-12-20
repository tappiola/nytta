import React from "react";
import { Chart } from "primereact/chart";
import { Card } from "primereact/card";
import { Dataset } from "@/app/ui/CategoryCharts";

const PieChart = ({ name, dataset }: { name: string; dataset: Dataset }) => {
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
    <Card className="w-3">
      <h1>{name}</h1>
      <Chart
        type="doughnut"
        data={getChartData(dataset)}
        options={chartOptions}
      />
    </Card>
  );
};

export default PieChart;
