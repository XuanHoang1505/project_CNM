import React from 'react';
import { Link } from 'react-router-dom';
import LineChart from '@/charts/LineChart01';
import { chartAreaGradient } from '@/charts/ChartjsConfig';
import EditMenu from '@/components/admin/common/DropdownEditMenu';

// Import utilities
import { adjustColorOpacity, getCssVariable } from '@/utils/Utils';

function DashboardCard01() {

  // Dữ liệu doanh thu VNĐ cho shop quần áo
  const chartData = {
    labels: [
      '01/2024','02/2024','03/2024','04/2024','05/2024','06/2024',
      '07/2024','08/2024','09/2024','10/2024','11/2024','12/2024',
      '01/2025'
    ],
    datasets: [
      // Doanh thu chính
      {
        data: [
          120000000, 150000000, 132000000, 165000000, 190000000, 210000000,
          185000000, 220000000, 240000000, 255000000, 268000000, 310000000, 330000000
        ],
        fill: true,
        backgroundColor: function(context) {
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
        tension: 0.25,
      },

      // Lượng đơn hàng (dữ liệu tham chiếu – màu xám)
      {
        data: [
          420, 510, 468, 502, 550, 590,
          572, 620, 640, 680, 710, 760, 800
        ],
        borderColor: adjustColorOpacity(getCssVariable('--color-gray-500'), 0.25),
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.25,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Shop Fashion</h2>

          <EditMenu align="right" className="relative inline-flex">
            <li>
              <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">
                Xem chi tiết
              </Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">
                Tải báo cáo
              </Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-red-500 hover:text-red-600 flex py-1 px-3" to="#0">
                Xóa widget
              </Link>
            </li>
          </EditMenu>
        </header>

        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Doanh thu</div>

        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">
            310.000.000₫
          </div>
          <div className="text-sm font-medium text-green-700 px-1.5 bg-green-500/20 rounded-full">
            +24%
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
