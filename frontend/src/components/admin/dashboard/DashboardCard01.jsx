import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import LineChart from "@/charts/LineChart01";
import { chartAreaGradient } from "@/charts/ChartjsConfig";
import EditMenu from "@/components/admin/common/DropdownEditMenu";
import { adjustColorOpacity, getCssVariable } from "@/utils/Utils";

function DashboardCard01({ data }) {
  const { chart, total, growth } = data;
  const { labels, revenue, orders } = chart;

  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          // Doanh thu
          data: revenue,
          fill: true,
          backgroundColor: (context) => {
            const { ctx, chartArea } = context.chart;
            return chartAreaGradient(ctx, chartArea, [
              {
                stop: 0,
                color: adjustColorOpacity(
                  getCssVariable("--color-violet-500"),
                  0
                ),
              },
              {
                stop: 1,
                color: adjustColorOpacity(
                  getCssVariable("--color-violet-500"),
                  0.2
                ),
              },
            ]);
          },
          borderColor: getCssVariable("--color-violet-500"),
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.25,
        },
        {
          // Số đơn hàng
          data: orders,
          borderColor: adjustColorOpacity(
            getCssVariable("--color-gray-500"),
            0.25
          ),
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.25,
        },
      ],
    }),
    [labels, revenue, orders]
  );

  if (!data || !data.chart) return null;

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-3 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Shop Fashion
          </h2>

          <EditMenu align="right">
            <li>
              <Link className="menu-item" to="#">
                Xem chi tiết
              </Link>
            </li>
            <li>
              <Link className="menu-item" to="#">
                Tải báo cáo
              </Link>
            </li>
          </EditMenu>
        </header>

        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">
          Doanh thu
        </div>

        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">
            {total.toLocaleString("vi-VN")}₫
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

export default DashboardCard01;
