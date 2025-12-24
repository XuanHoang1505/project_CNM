import React from 'react';
import DoughnutChart from '@/charts/DoughnutChart';
import { getCssVariable } from '@/utils/Utils';

function DashboardCard06() {

  const chartData = {
    labels: ['Áo', 'Quần', 'Giày', 'Phụ kiện'],
    datasets: [
      {
        label: 'Sales by Category',
        data: [45, 30, 15, 10], // dữ liệu ví dụ (bạn thay bằng API)
        backgroundColor: [
          getCssVariable('--color-violet-500'),
          getCssVariable('--color-sky-500'),
          getCssVariable('--color-emerald-500'),
          getCssVariable('--color-amber-500'),
        ],
        hoverBackgroundColor: [
          getCssVariable('--color-violet-600'),
          getCssVariable('--color-sky-600'),
          getCssVariable('--color-emerald-600'),
          getCssVariable('--color-amber-600'),
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Sales by Category
        </h2>
      </header>

      <DoughnutChart data={chartData} width={389} height={260} />
    </div>
  );
}

export default DashboardCard06;
