import React from "react";

function DashboardCard07({ data }) {
  if (!data) return null;

  const formatVND = (value) => Number(value).toLocaleString("vi-VN") + "₫";

  return (
    <div className="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Top Sản Phẩm Bán Chạy
        </h2>
      </header>

      <div className="p-3 overflow-x-auto">
        <table className="table-auto w-full text-sm dark:text-gray-300">
          <thead className="uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Sản phẩm</th>
              <th className="p-2 text-center">Đã bán</th>
              <th className="p-2 text-right">Doanh thu</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
            {data.map((item, index) => (
              <tr key={item.product_id}>
                <td className="p-2 font-semibold">{index + 1}</td>

                <td className="p-2 text-gray-800 dark:text-gray-100">
                  {item.product_name}
                </td>

                <td className="p-2 text-center font-medium text-sky-600">
                  {item.total_sold}
                </td>

                <td className="p-2 text-right font-semibold text-green-600">
                  {formatVND(item.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardCard07;
