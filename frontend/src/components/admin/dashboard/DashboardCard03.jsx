import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import LineChart from "@/charts/LineChart01";
import { chartAreaGradient } from "@/charts/ChartjsConfig";
import EditMenu from "@/components/admin/common/DropdownEditMenu";
import { adjustColorOpacity, getCssVariable } from "@/utils/Utils";

const COLOR_MAP = {
  violet: "--color-violet-500",
  blue: "--color-blue-500",
  green: "--color-green-500",
  red: "--color-red-500",
};

function DashboardCard03({
  title,
  subtitle,
  chartLabel,
  color = "violet",
  data,
}) {
  const chartData = useMemo(() => {
    if (!data?.chart) return null;

    const colorVar = COLOR_MAP[color];

    return {
      labels: data.chart.labels,
      datasets: [
        {
          label: chartLabel,
          data: data.chart.data,
          fill: true,
          backgroundColor: (context) => {
            const { ctx, chartArea } = context.chart;
            return chartAreaGradient(ctx, chartArea, [
              {
                stop: 0,
                color: adjustColorOpacity(getCssVariable(colorVar), 0),
              },
              {
                stop: 1,
                color: adjustColorOpacity(getCssVariable(colorVar), 0.2),
              },
            ]);
          },
          borderColor: getCssVariable(colorVar),
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.25,
        },
      ],
    };
  }, [data, chartLabel, color]);

  if (!data || !chartData) return null;

  const { total, growth } = data;

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-3 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h2>

          <EditMenu align="right">
            <li>
              <Link className="menu-item" to="#">
                Xem chi tiết
              </Link>
            </li>
            <li>
              <Link className="menu-item text-red-500" to="#">
                Remove
              </Link>
            </li>
          </EditMenu>
        </header>

        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">
          {subtitle}
        </div>

        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">
            {total}
          </div>

          <div
            className={`text-sm font-medium px-1.5 rounded-full ${
              growth >= 0
                ? "text-green-700 bg-green-500/20"
                : "text-red-700 bg-red-500/20"
            }`}
          >
            {growth > 0 ? "+" : ""}
            {growth}%
          </div>
        </div>
      </div>

      <div className="grow max-sm:max-h-[128px] xl:max-h-[128px]">
        <LineChart data={chartData} width={389} height={128} />
      </div>
    </div>
  );
}

export default DashboardCard03;
