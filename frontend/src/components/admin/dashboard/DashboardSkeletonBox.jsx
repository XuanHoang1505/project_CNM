import React from "react";

function DashboardSkeletonBox({ className = "", height = 200 }) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5 animate-pulse ${className}`}
    >
      <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div
        className="bg-gray-200 dark:bg-gray-700 rounded"
        style={{ height }}
      />
    </div>
  );
}

export default DashboardSkeletonBox;
