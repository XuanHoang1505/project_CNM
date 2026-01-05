import React, { useRef, useEffect, useState } from "react";
import { useThemeProvider } from "../utils/ThemeContext";
import { chartColors } from "./ChartjsConfig";

import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { formatThousands } from "../utils/Utils";

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function BarChart04({ data, width, height }) {
  const canvas = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === "dark";

  const {
    textColor,
    gridColor,
    tooltipBodyColor,
    tooltipBgColor,
    tooltipBorderColor,
  } = chartColors;

  const [chart, setChart] = useState(null);

  // Init chart
  useEffect(() => {
    const ctx = canvas.current;

    const newChart = new Chart(ctx, {
      type: "bar",
      data,
      options: {
        indexAxis: "y", // ✅ bar ngang
        maintainAspectRatio: false,
        animation: { duration: 400 },

        layout: {
          padding: { top: 8, bottom: 8, left: 12, right: 12 },
        },

        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0,
              color: darkMode ? textColor.dark : textColor.light,
            },
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
          },
          y: {
            ticks: {
              autoSkip: false,
              color: darkMode ? textColor.dark : textColor.light,
            },
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
          },
        },

        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${formatThousands(ctx.parsed.x)} lượt yêu thích`,
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
        },
      },
    });

    setChart(newChart);
    return () => newChart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update theme
  useEffect(() => {
    if (!chart) return;

    chart.options.scales.x.ticks.color = darkMode
      ? textColor.dark
      : textColor.light;
    chart.options.scales.y.ticks.color = darkMode
      ? textColor.dark
      : textColor.light;
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
  }, [currentTheme]);

  return (
    <div className="grow">
      <canvas ref={canvas} width={width} height={height} />
    </div>
  );
}

export default BarChart04;
