import React from "react";
import DashboardSkeletonBox from "./DashboardSkeletonBox";

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* ===== ROW 1: 4 CARDS ===== */}
      <DashboardSkeletonBox
        className="col-span-12 sm:col-span-6 xl:col-span-3"
        height={120}
      />
      <DashboardSkeletonBox
        className="col-span-12 sm:col-span-6 xl:col-span-3"
        height={120}
      />
      <DashboardSkeletonBox
        className="col-span-12 sm:col-span-6 xl:col-span-3"
        height={120}
      />
      <DashboardSkeletonBox
        className="col-span-12 sm:col-span-6 xl:col-span-3"
        height={120}
      />

      {/* ===== ROW 2: 2 CHARTS ===== */}
      <DashboardSkeletonBox
        className="col-span-12 xl:col-span-6"
        height={280}
      />
      <DashboardSkeletonBox
        className="col-span-12 xl:col-span-6"
        height={280}
      />

      {/* ===== ROW 3: PIE CHART + TABLE ===== */}
      <DashboardSkeletonBox
        className="col-span-12 xl:col-span-5"
        height={300}
      />
      <DashboardSkeletonBox
        className="col-span-12 xl:col-span-7"
        height={300}
      />

      {/* ===== ROW 4: TABLE + BAR CHART ===== */}
      <DashboardSkeletonBox
        className="col-span-12 xl:col-span-7"
        height={320}
      />
      <DashboardSkeletonBox
        className="col-span-12 xl:col-span-5"
        height={320}
      />
    </div>
  );
}

export default DashboardSkeleton;
