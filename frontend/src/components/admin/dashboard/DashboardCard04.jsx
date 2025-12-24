import React from 'react';
import BarChart from '@/charts/BarChart01';
import { getCssVariable } from '@/utils/Utils';

function DashboardCard04() {

  const chartData = {
    labels: [
      '12-2022', '01-2023', '02-2023',
      '03-2023', '04-2023', '05-2023',
    ],
    datasets: [
      // Doanh thu online
      {
        label: 'Online',
        data: [
          95000000, 120000000, 110000000, 135000000, 145000000, 160000000,
        ],
        backgroundColor: getCssVariable('--color-sky-500'),
        hoverBackgroundColor: getCssVariable('--color-sky-600'),
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
      // Doanh thu cửa hàng (offline)
      {
        label: 'Offline',
        data: [
          140000000, 150000000, 158000000, 165000000, 172000000, 180000000,
        ],
        backgroundColor: getCssVariable('--color-violet-500'),
        hoverBackgroundColor: getCssVariable('--color-violet-600'),
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Doanh thu Online vs Offline</h2>
      </header>

      <BarChart data={chartData} width={595} height={248} />
    </div>
  );
}

export default DashboardCard04;
