import React, { useMemo } from "react";
import BarChart04 from "@/charts/BarChart04";
import { getCssVariable } from "@/utils/Utils";

function DashboardCardWishlist({ data = [] }) {
  const chartData = useMemo(() => {
    if (!data.length) return null;

    const colors = [
      "--color-violet-500",
      "--color-pink-500",
      "--color-blue-500",
      "--color-green-500",
      "--color-yellow-500",
    ].map(getCssVariable);

    return {
      labels: data.map((item) => item.name),
      datasets: [
        {
          label: "Wishlist",
          data: data.map((item) => item.wishlist_count),
          backgroundColor: data.map((_, idx) => colors[idx % colors.length]),
          borderRadius: 6,
          barPercentage: 0.7,
          categoryPercentage: 0.9,
        },
      ],
    };
  }, [data]);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Top sản phẩm được yêu thích
        </h2>
      </header>

      <div className="p-5 grow">
        {chartData ? (
          <BarChart04 data={chartData} width={600} height={300} />
        ) : (
          <div className="text-sm text-gray-500">Chưa có dữ liệu wishlist</div>
        )}
      </div>
    </div>
  );
}

export default DashboardCardWishlist;
