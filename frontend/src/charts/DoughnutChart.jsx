import React, { useRef, useEffect, useState } from "react";
import { useThemeProvider } from "../utils/ThemeContext";
import { chartColors } from "./ChartjsConfig";
import {
  Chart,
  DoughnutController,
  ArcElement,
  TimeScale,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-moment";

Chart.register(DoughnutController, ArcElement, TimeScale, Tooltip);

function DoughnutChart({ data, width, height }) {
  const [chart, setChart] = useState(null);
  const canvas = useRef(null);
  const legend = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === "dark";
  const {
    tooltipTitleColor,
    tooltipBodyColor,
    tooltipBgColor,
    tooltipBorderColor,
  } = chartColors;

  // Tạo chart lần đầu
  useEffect(() => {
    if (!canvas.current) return;
    const ctx = canvas.current;

    const newChart = new Chart(ctx, {
      type: "doughnut",
      data,
      options: {
        cutout: "80%",
        layout: { padding: 24 },
        plugins: {
          legend: { display: false },
          tooltip: {
            titleColor: darkMode
              ? tooltipTitleColor.dark
              : tooltipTitleColor.light,
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
              li.style.margin = "4px";
              const button = document.createElement("button");
              button.classList.add(
                "btn-xs",
                "bg-white",
                "dark:bg-gray-700",
                "text-gray-500",
                "dark:text-gray-400",
                "shadow-xs",
                "shadow-black/[0.08]",
                "rounded-full"
              );
              button.style.opacity = item.hidden ? ".3" : "";
              button.onclick = () => {
                c.toggleDataVisibility(item.index);
                c.update();
              };

              const box = document.createElement("span");
              box.style.display = "block";
              box.style.width = "8px";
              box.style.height = "8px";
              box.style.backgroundColor = item.fillStyle;
              box.style.borderRadius = "4px";
              box.style.marginRight = "4px";
              box.style.pointerEvents = "none";

              const label = document.createElement("span");
              label.style.display = "flex";
              label.style.alignItems = "center";
              label.appendChild(document.createTextNode(item.text));

              li.appendChild(button);
              button.appendChild(box);
              button.appendChild(label);
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
    chart.options.plugins.tooltip.titleColor = darkMode
      ? tooltipTitleColor.dark
      : tooltipTitleColor.light;
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
    chart.update("active");
  }, [data, chart]);

  return (
    <div className="grow flex flex-col justify-center">
      <div>
        <canvas ref={canvas} width={width} height={height}></canvas>
      </div>
      <div className="px-5 pt-2 pb-6">
        <ul ref={legend} className="flex flex-wrap justify-center -m-1"></ul>
      </div>
    </div>
  );
}

export default DoughnutChart;
