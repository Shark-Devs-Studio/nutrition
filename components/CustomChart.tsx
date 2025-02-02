"use client";
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { eachHourOfInterval, format } from "date-fns";
import CustomBarItem from "./children/CustomBarItem";

// Генерация времени с 09:00 до 18:00 следующего дня
const customTicks = eachHourOfInterval({
   start: new Date(2000, 1, 1, 9, 0), // 09:00 текущего дня
   end: new Date(2000, 1, 2, 18, 0), // 18:00 следующего дня
}).map((date) => format(date, "HH:mm"));

const timeToIndex = (time: string) => {
   const index = customTicks.indexOf(time);
   return index !== -1 ? index : 0;
};

const formatTime = (index: number) => customTicks[index] || "";

const data = [
   { day: "Ср-Чт", start: "14:00", end: "00:00", progress: 50 },
   { day: "Чт-Пт", start: "19:08", end: "05:22", progress: 50 },
   { day: "Пт-Сб", start: "13:08", end: "18:24", progress: 50 },
   { day: "Сб-Вс", start: "09:05", end: "12:35", progress: 50 },
   { day: "Вс-Пн", start: "11:22", end: "17:55", progress: 50 },
   { day: "Пн-Вт", start: "14:05", end: "18:35", progress: 50 },
];

const CustomChart = () => {
   const chartRef = useRef<any>(null);
   const containerRef = useRef<any>(null);
   const [bars, setBars] = useState<any[]>([]);

   useEffect(() => {
      if (!chartRef.current || data.length === 0) return;

      const ctx: any = chartRef.current.getContext("2d");

      const chartInstance = new Chart(ctx, {
         type: "bar",
         data: {
            labels: data.map((d) => d.day),
            datasets: [
               {
                  label: "Временные интервалы",
                  data: data.map((d) => ({
                     x: d.day,
                     y: [timeToIndex(d.start), timeToIndex(d.end)],
                  })),
                  backgroundColor: "transparent",
                  borderColor: "transparent",
               },
            ],
         },
         options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: "x",
            scales: {
               x: {
                  type: "category",
                  labels: data.map((d) => d.day),
                  grid: { display: false },
               },
               y: {
                  type: "linear",
                  min: 0,
                  max: customTicks.length - 1,
                  ticks: {
                     stepSize: 5,
                     callback: (value: any) => customTicks[value] || "",
                  },
               },
            },
            plugins: {
               tooltip: {
                  callbacks: {
                     label: function (tooltipItem: any) {
                        const { dataset, dataIndex } = tooltipItem;
                        const { y } = dataset.data[dataIndex];

                        const startTime = customTicks[y[0]];
                        const endTime = customTicks[y[1] % customTicks.length];

                        return `С ${startTime} до ${endTime}`;
                     },
                  },
               },
               legend: { display: false },
            },
         },
      });

      setTimeout(() => {
         const chartBars: any = chartInstance.data.datasets[0].data
            .map((bar, index) => {
               const meta = chartInstance.getDatasetMeta(0).data[index];
               if (!meta) return null;

               const rect = containerRef.current.getBoundingClientRect();
               const canvasRect = chartRef.current.getBoundingClientRect();

               // Расчет координат для отображения баров
               const yStart = chartInstance.scales.y.getPixelForValue(bar.y[0]);
               const yEnd = chartInstance.scales.y.getPixelForValue(bar.y[1]);

               return {
                  x: meta.x + rect.left - canvasRect.left,
                  yStart: yStart + rect.top - canvasRect.top,
                  yEnd: yEnd + rect.top - canvasRect.top,
                  height: Math.abs(yEnd - yStart),
                  start: formatTime(bar.y[0]),
                  end: formatTime(bar.y[1]),
                  index,
               };
            })
            .filter(Boolean);

         setBars(chartBars);
      }, 1000);

      return () => chartInstance.destroy();
   }, [data]);

   return (
      <div
         ref={containerRef}
         style={{
            position: "relative",
            width: "100%",
            height: "400px",
            overflow: "hidden",
         }}
      >
         <canvas
            ref={chartRef}
            style={{ width: "100%", height: "100%" }}
         ></canvas>

         {bars.map(({ x, yStart, height, start, end, index }) => (
            <CustomBarItem
               key={index}
               x={x}
               y={yStart}
               height={height}
               start={start}
               end={end}
               progress={50}
            />
         ))}
      </div>
   );
};

export default CustomChart;
