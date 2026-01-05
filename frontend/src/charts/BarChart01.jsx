import React, { useRef, useEffect, useState } from "react";
import { useThemeProvider } from "../utils/ThemeContext";

import { chartColors } from "./ChartjsConfig";
import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-moment";
import { formatValue } from "../utils/Utils";

Chart.register(
  BarController,
  BarElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend
);

function BarChart01({ data, width, height }) {
  const [chart, setChart] = useState(null);
  const canvas = useRef(null);
  const legend = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === "dark";
  const {
    textColor,
    gridColor,
    tooltipBodyColor,
    tooltipBgColor,
    tooltipBorderColor,
  } = chartColors;

  // Khởi tạo chart
  useEffect(() => {
    if (!canvas.current) return;
    const ctx = canvas.current;

    const newChart = new Chart(ctx, {
      type: "bar",
      data,
      options: {
        layout: { padding: { top: 12, bottom: 16, left: 20, right: 20 } },
        scales: {
          y: {
            border: { display: false },
            ticks: {
              maxTicksLimit: 5,
              callback: (v) => formatValue(v),
              color: darkMode ? textColor.dark : textColor.light,
            },
            grid: { color: darkMode ? gridColor.dark : gridColor.light },
          },
          x: {
            type: "time",
            time: {
              parser: "MM-DD-YYYY",
              unit: "month",
              displayFormats: { month: "MMM YY" },
            },
            border: { display: false },
            grid: { display: false },
            ticks: { color: darkMode ? textColor.dark : textColor.light },
          },
        },
        plugins: {
          legend: { display: false },
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
        },
        interaction: { intersect: false, mode: "nearest" },
        animation: { duration: 500 },
        maintainAspectRatio: false,
        resizeDelay: 200,
      },
      plugins: [
        {
          id: "htmlLegend",
          afterUpdate(c) {
            const ul = legend.current;
            if (!ul) return;
            while (ul.firstChild) ul.firstChild.remove();
            const items = c.options.plugins.legend.labels.generateLabels(c);
            items.forEach((item) => {
              const li = document.createElement("li");
              const button = document.createElement("button");
              button.style.display = "inline-flex";
              button.style.alignItems = "center";
              button.style.opacity = item.hidden ? ".3" : "";
              button.onclick = () => {
                c.setDatasetVisibility(
                  item.datasetIndex,
                  !c.isDatasetVisible(item.datasetIndex)
                );
                c.update();
              };
              const box = document.createElement("span");
              box.style.display = "block";
              box.style.width = "12px";
              box.style.height = "12px";
              box.style.borderRadius = "calc(infinity * 1px)";
              box.style.marginRight = "8px";
              box.style.borderWidth = "3px";
              box.style.borderColor = item.fillStyle;
              box.style.pointerEvents = "none";
              const labelContainer = document.createElement("span");
              labelContainer.style.display = "flex";
              labelContainer.style.alignItems = "center";
              const value = document.createElement("span");
              value.classList.add("text-gray-800", "dark:text-gray-100");
              value.style.fontSize = "30px";
              value.style.lineHeight = "calc(2.25 / 1.875)";
              value.style.fontWeight = "700";
              value.style.marginRight = "8px";
              value.style.pointerEvents = "none";
              const label = document.createElement("span");
              label.classList.add("text-gray-500", "dark:text-gray-400");
              label.style.fontSize = "14px";
              label.style.lineHeight = "calc(1.25 / 0.875)";
              const theValue = c.data.datasets[item.datasetIndex].data.reduce(
                (a, b) => a + b,
                0
              );
              value.appendChild(document.createTextNode(formatValue(theValue)));
              label.appendChild(document.createTextNode(item.text));
              li.appendChild(button);
              button.appendChild(box);
              button.appendChild(labelContainer);
              labelContainer.appendChild(value);
              labelContainer.appendChild(label);
              ul.appendChild(li);
            });
          },
        },
      ],
    });

    setChart(newChart);
    return () => newChart.destroy();
  }, []);

  // Cập nhật theme
  useEffect(() => {
    if (!chart) return;
    chart.options.scales.x.ticks.color = darkMode
      ? textColor.dark
      : textColor.light;
    chart.options.scales.y.ticks.color = darkMode
      ? textColor.dark
      : textColor.light;
    chart.options.scales.y.grid.color = darkMode
      ? gridColor.dark
      : gridColor.light;
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

  // **Cập nhật chart khi data thay đổi**
  useEffect(() => {
    if (!chart) return;
    chart.data.labels = data.labels;
    chart.data.datasets = data.datasets;
    chart.update("active"); // animate update
  }, [data, chart]);

  return (
    <>
      <div className="px-5 py-3">
        <ul ref={legend} className="flex flex-wrap gap-x-4"></ul>
      </div>
      <div className="grow">
        <canvas ref={canvas} width={width} height={height}></canvas>
      </div>
    </>
  );
}

export default BarChart01;
