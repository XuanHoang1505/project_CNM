import React, { useMemo } from "react";
import BarChart from "@/charts/BarChart01";
import { getCssVariable } from "@/utils/Utils";

function DashboardCard04({ data }) {
  const chartData = useMemo(() => {
    if (!data) return null;

    const labels = data.map(
      (item) => `${String(item.month).padStart(2, "0")}/2024`
    );

    const revenues = data.map((item) => Number(item.revenue));

    return {
      labels,
      datasets: [
        {
          label: "Doanh thu",
          data: revenues,
          backgroundColor: getCssVariable("--color-sky-500"),
          hoverBackgroundColor: getCssVariable("--color-sky-600"),
          barPercentage: 0.7,
          categoryPercentage: 0.7,
          borderRadius: 4,
        },
      ],
    };
  }, [data]);

  if (!chartData) return null;

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Doanh thu theo tháng
        </h2>
      </header>

      <BarChart data={chartData} width={595} height={248} />
    </div>
  );
}

export default DashboardCard04;
