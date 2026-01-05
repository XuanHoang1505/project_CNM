import React from "react";
import { cn } from "@/lib/utils"; // nếu bạn dùng utility classnames

export default function YearPicker({ year, setYear, className }) {
  // Lấy danh sách 10 năm gần nhất
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className={cn("relative inline-block", className)}>
      <select
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        className="appearance-none [-webkit-appearance:none] [-moz-appearance:none] border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 py-2 px-3 rounded-md pr-8 cursor-pointer"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
