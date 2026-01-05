import React, { useMemo } from "react";
import DoughnutChart from "@/charts/DoughnutChart";
import { getCssVariable } from "@/utils/Utils";

function DashboardCard06({ data }) {
  const chartData = useMemo(() => {
    if (!data) return null;

    const labels = data.map((item) => item.category);
    const values = data.map((item) => Number(item.total));

    const colors = [
      getCssVariable("--color-violet-500"),
      getCssVariable("--color-sky-500"),
      getCssVariable("--color-emerald-500"),
      getCssVariable("--color-amber-500"),
      getCssVariable("--color-rose-500"),
    ];

    return {
      labels,
      datasets: [
        {
          label: "Sales by Category",
          data: values,
          backgroundColor: labels.map((_, i) => colors[i % colors.length]),
          hoverBackgroundColor: labels.map((_, i) =>
            colors[i % colors.length].replace("500", "600")
          ),
          borderWidth: 0,
        },
      ],
    };
  }, [data]);

  if (!chartData) return null;

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Doanh thu theo danh mục
        </h2>
      </header>

      <DoughnutChart data={chartData} width={389} height={260} />
    </div>
  );
}

export default DashboardCard06;
