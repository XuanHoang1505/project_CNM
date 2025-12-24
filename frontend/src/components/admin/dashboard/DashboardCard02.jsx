import React from 'react';
import { Link } from 'react-router-dom';
import LineChart from '@/charts/LineChart01';
import { chartAreaGradient } from '@/charts/ChartjsConfig';
import EditMenu from '@/components/admin/common/DropdownEditMenu';

// Import utilities
import { adjustColorOpacity, getCssVariable } from '@/utils/Utils';

function DashboardCard02() {

  // Dữ liệu VNĐ cho shop quần áo
  const chartData = {
    labels: [
      '12-2022','01-2023','02-2023','03-2023','04-2023','05-2023',
      '06-2023','07-2023','08-2023','09-2023','10-2023','11-2023',
      '12-2023','01-2024','02-2024','03-2024','04-2024','05-2024',
      '06-2024','07-2024','08-2024','09-2024','10-2024','11-2024',
      '12-2024','01-2025',
    ],

    datasets: [
      // Doanh thu theo tháng (VNĐ)
      {
        data: [
          150000000, 152000000, 146000000, 155000000, 160000000, 158000000,
          170000000, 185000000, 190000000, 210000000, 230000000, 250000000,
          268000000, 280000000, 300000000, 315000000, 320000000, 340000000,
          360000000, 380000000, 395000000, 410000000, 430000000, 460000000,
          480000000, 500000000,
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

      // Số lượng đơn hàng (tham chiếu)
      {
        data: [
          420, 430, 410, 440, 460, 470, 480, 520, 540, 560, 600, 640,
          660, 700, 720, 740, 760, 820,
          850, 880, 900, 920, 950, 980, 1000, 1050
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
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Doanh thu nâng cao</h2>

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
            500.000.000₫
          </div>
          <div className="text-sm font-medium text-red-700 px-1.5 bg-red-500/20 rounded-full">
            -14%
          </div>
        </div>
      </div>

      <div className="grow max-sm:max-h-[128px] max-h-[128px]">
        <LineChart data={chartData} width={389} height={128} />
      </div>
    </div>
  );
}

export default DashboardCard02;
