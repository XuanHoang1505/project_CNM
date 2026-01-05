import React from "react";
import DefaultAvatar from "@/assets/site/images/avatar-default-lg.png";

function DashboardCard10({ data }) {
  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Top khách hàng theo chi tiêu
        </h2>
      </header>

      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Header */}
            <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Spent</th>
                <th className="p-2 text-center">Country</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {data.map((customer) => (
                <tr key={customer.id}>
                  <td className="p-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 shrink-0 mr-3">
                        <img
                          className="rounded-full"
                          src={customer.avatar || DefaultAvatar}
                          alt={customer.full_name}
                        />
                      </div>
                      <div className="font-medium text-gray-800 dark:text-gray-100">
                        {customer.full_name}
                      </div>
                    </div>
                  </td>

                  <td className="p-2">{customer.email}</td>

                  <td className="p-2 font-medium text-green-500">
                    {Number(customer.spent).toLocaleString("vi-VN")}₫
                  </td>

                  <td className="p-2 text-center text-lg">🇻🇳</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard10;
