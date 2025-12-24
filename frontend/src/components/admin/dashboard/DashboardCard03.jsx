import React from 'react';
import { Link } from 'react-router-dom';
import LineChart from '@/charts/LineChart01';
import { chartAreaGradient } from '@/charts/ChartjsConfig';
import EditMenu from '@/components/admin/common/DropdownEditMenu';

// Import utilities
import { adjustColorOpacity, getCssVariable } from '@/utils/Utils';

function DashboardCard03() {

  const chartData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [
      // New Users
      {
        label: 'User mới',
        data: [120, 140, 180, 150, 200, 230, 260, 300, 280, 310, 340, 360],
        fill: true,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          return chartAreaGradient(ctx, chartArea, [
            { stop: 0, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0) },
            { stop: 1, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0.2) }
          ]);
        },
        borderColor: getCssVariable('--color-violet-500'),
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.2,
      },

      // Active Users
      {
        label: 'User hoạt động',
        data: [200, 220, 250, 240, 260, 280, 310, 330, 320, 350, 380, 410],
        borderColor: adjustColorOpacity(getCssVariable('--color-gray-500'), 0.4),
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            User Statistics
          </h2>

          <EditMenu align="right" className="relative inline-flex">
            <li>
              <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">
                Xem chi tiết
              </Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-red-500 hover:text-red-600 flex py-1 px-3" to="#0">
                Remove
              </Link>
            </li>
          </EditMenu>
        </header>

        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">
          Tổng user trong tháng
        </div>

        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">
            360
          </div>
          <div className="text-sm font-medium text-green-700 px-1.5 bg-green-500/20 rounded-full">
            +12%
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
