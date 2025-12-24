import React from 'react';

function DashboardCard07() {
  const products = [
    {
      id: 1,
      name: 'Áo Thun Nam Basic',
      icon: '👕',
      color: 'from-blue-500 to-blue-600',
      views: '3.2K',
      revenue: '45.800.000₫',
      sales: 458,
      conversion: '14.3%'
    },
    {
      id: 2,
      name: 'Sơ Mi Công Sở',
      icon: '👔',
      color: 'from-purple-500 to-purple-600',
      views: '2.8K',
      revenue: '39.200.000₫',
      sales: 392,
      conversion: '14.0%'
    },
    {
      id: 3,
      name: 'Quần Jean Slim Fit',
      icon: '👖',
      color: 'from-orange-500 to-orange-600',
      views: '2.5K',
      revenue: '37.500.000₫',
      sales: 375,
      conversion: '15.0%'
    },
    {
      id: 4,
      name: 'Áo Khoác Gió',
      icon: '🧥',
      color: 'from-green-500 to-green-600',
      views: '2.1K',
      revenue: '31.500.000₫',
      sales: 315,
      conversion: '15.0%'
    },
    {
      id: 5,
      name: 'Đầm Nữ Dự Tiệc',
      icon: '👗',
      color: 'from-pink-500 to-pink-600',
      views: '1.9K',
      revenue: '28.500.000₫',
      sales: 285,
      conversion: '15.0%'
    }
  ];

  return (
    <div className="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Top Sản Phẩm Bán Chạy</h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            {/* Table header */}
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs">
              <tr>
                <th className="p-2">
                  <div className="font-semibold text-left">Sản Phẩm</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Lượt Xem</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Doanh Thu</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Đã Bán</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Tỷ Lệ</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="p-2">
                    <div className="flex items-center">
                      <div className={`shrink-0 mr-2 sm:mr-3 w-9 h-9 bg-gradient-to-br ${product.color} rounded-lg flex items-center justify-center`}>
                        <span className="text-white text-lg">{product.icon}</span>
                      </div>
                      <div className="text-gray-800 dark:text-gray-100">{product.name}</div>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="text-center">{product.views}</div>
                  </td>
                  <td className="p-2">
                    <div className="text-center text-green-500">{product.revenue}</div>
                  </td>
                  <td className="p-2">
                    <div className="text-center">{product.sales}</div>
                  </td>
                  <td className="p-2">
                    <div className="text-center text-sky-500">{product.conversion}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard07;