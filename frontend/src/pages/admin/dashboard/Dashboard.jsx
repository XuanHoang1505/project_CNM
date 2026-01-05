import React, { useEffect, useState } from "react";

import DashboardCard01 from "@/components/admin/dashboard/DashboardCard01";
import DashboardCard03 from "@/components/admin/dashboard/DashboardCard03";
import DashboardCard04 from "@/components/admin/dashboard/DashboardCard04";
import DashboardCard06 from "@/components/admin/dashboard/DashboardCard06";
import DashboardCard07 from "@/components/admin/dashboard/DashboardCard07";
import DashboardCard10 from "@/components/admin/dashboard/DashboardCard10";
import DashboardCard12 from "@/components/admin/dashboard/DashboardCard12";
import DashboardService from "@/services/admin/DashboardService";
import DashboardCardWishlist from "@/components/admin/dashboard/DashboardCardWishlist";
import YearPicker from "@/components/admin/common/YearPicker";
import DashboardSkeleton from "@/components/admin/dashboard/DashboardSkeleton";

function Dashboard() {
  const [data, setData] = useState(null);
  const [year, setYear] = useState(2024);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    DashboardService.getDashboard(year)
      .then(setData)
      .finally(() => setLoading(false));
  }, [year]);

  return (
    <main className="grow">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        {/* HEADER */}
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Dashboard
          </h1>
          <YearPicker year={year} setYear={setYear} />
        </div>

        {/* CONTENT */}
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <div className="grid grid-cols-12 gap-6">
            <DashboardCard01 data={data.cards.revenue} />
            <DashboardCard03 title="Đơn hàng" data={data.cards.orders} />
            <DashboardCard03 title="Người dùng" data={data.cards.users} />
            <DashboardCard03 title="Đánh giá" data={data.cards.reviews} />

            <DashboardCard04 data={data.charts.revenue_by_month} />
            <DashboardCard12 recentActivities={data.tables.recent_activities} />

            <DashboardCard06 data={data.charts.sales_by_category} />
            <DashboardCard07 data={data.tables.top_selling_products} />

            <DashboardCard10 data={data.tables.customers} />
            <DashboardCardWishlist data={data.tables.top_wishlist_products} />
          </div>
        )}
      </div>
    </main>
  );
}

export default Dashboard;
