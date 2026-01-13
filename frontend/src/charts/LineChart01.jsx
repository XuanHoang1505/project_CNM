import React, { useRef, useEffect, useState } from "react";
import { useThemeProvider } from "../utils/ThemeContext";

import { chartColors } from "./ChartjsConfig";
import {
  Chart,
  LineController,
  LineElement,
  Filler,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-moment";
import { formatValue } from "../utils/Utils";

Chart.register(
  LineController,
  LineElement,
  Filler,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip
);

function LineChart01({ data, width, height }) {
  const [chart, setChart] = useState(null);
  const canvas = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === "dark";
  const { tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;

  // Khởi tạo chart 1 lần
  useEffect(() => {
    if (!canvas.current) return;
    const ctx = canvas.current;

    const newChart = new Chart(ctx, {
      type: "line",
      data,
      options: {
        layout: { padding: 20 },
        scales: {
          y: { display: false, beginAtZero: true },
          x: {
            type: "time",
            time: { parser: "MM-DD-YYYY", unit: "month" },
            display: false,
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: () => false,
              label: (ctx) => formatValue(ctx.parsed.y),
            },
            bodyColor: darkMode
              ? tooltipBodyColor.dark
              : tooltipBodyColor.light,
            backgroundColor: darkMode
              ? tooltipBgColor.dark
              : tooltipBgColor.light,
            borderColor: darkMode
              ? tooltipBorderColor.dark
              : tooltipBorderColor.light,
          },
          legend: { display: false },
        },
        interaction: { intersect: false, mode: "nearest" },
        maintainAspectRatio: false,
        resizeDelay: 200,
      },
    });

    setChart(newChart);
    return () => newChart.destroy();
  }, []);

  // Update chart khi theme thay đổi
  useEffect(() => {
    if (!chart) return;
    chart.options.plugins.tooltip.bodyColor = darkMode
      ? tooltipBodyColor.dark
      : tooltipBodyColor.light;
    chart.options.plugins.tooltip.backgroundColor = darkMode
      ? tooltipBgColor.dark
      : tooltipBgColor.light;
    chart.options.plugins.tooltip.borderColor = darkMode
      ? tooltipBorderColor.dark
      : tooltipBorderColor.light;
    chart.update("none");
  }, [currentTheme, chart]);

  // **Update chart khi prop `data` thay đổi**
  useEffect(() => {
    if (!chart) return;
    chart.data.labels = data.labels;
    chart.data.datasets = data.datasets;
    chart.update("active"); // animate line
  }, [data, chart]);

  return <canvas ref={canvas} width={width} height={height}></canvas>;
}

export default LineChart01;
