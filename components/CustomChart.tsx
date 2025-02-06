"use client";
import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js";
import dayjs from "dayjs";
import CustomBar from "./children/CustomBarItem";
import { addMinutes, eachMinuteOfInterval, format } from "date-fns";
import {
   fastingEndAtom,
   fastingStartAtom,
   isFastingAtom,
   mealsTimeAtom,
} from "@/lib/state";
import { useAtom } from "jotai";

const CustomChart = () => {
   const [start] = useAtom(fastingStartAtom);
   const [end] = useAtom(fastingEndAtom);
   const [isFasting] = useAtom(isFastingAtom);
   const chartRef = useRef<any>(null);
   const [customBars, setCustomBars] = useState<any[]>([]);

   const [mealsTime] = useAtom(mealsTimeAtom);
   const supperEnd = dayjs(mealsTime.supperRange[1], "HH:mm");

   const startTime = new Date();
   startTime.setHours(9, 0, 0, 0);
   const endTime = addMinutes(startTime, 33 * 60);

   const customTicks = eachMinuteOfInterval(
      { start: startTime, end: endTime },
      { step: 1 }
   ).map((date) => format(date, "HH:mm"));

   const timeToIndex = (time: string) => customTicks.indexOf(time);

   const parseTime = (time: string | null) => {
      if (!time) return customTicks.length - 1; // если time null или undefined, возвращаем последний индекс

      const parsedTime = new Date(`1982-01-01T${time}:00`);

      if (isNaN(parsedTime.getTime())) return customTicks.length - 1; // если время невалидное, возвращаем последний индекс

      const formattedTime = format(parsedTime, "HH:mm");

      const index = timeToIndex(formattedTime);

      return index !== -1 ? index : customTicks.length - 1;
   };

   useEffect(() => {
      if (chartRef.current) {
         const ctx = chartRef.current.getContext("2d");
         if (chartRef.current.chartInstance) {
            chartRef.current.chartInstance.destroy();
         }
         const newCustomBars = [
            { label: "Пт-Вт", start: "20:22", end: "10:48", progress: 100 },
            { label: "Вт-Ср", start: "23:00", end: "06:59", progress: 100 },
            { label: "Ср-Чт", start: "21:00", end: "05:19", progress: 100 },
            { label: "Чт-Пт", start: "01:11", end: "08:29", progress: 100 },
            { label: "Пт-Сб", start: "20:00", end: "06:14", progress: 100 },
            { label: "Сб-Вс", start: "22:00", end: "10:00", progress: 100 },
            {
               label: "Вс-Пн",
               start: start ? dayjs(start).format("HH:mm") : null,
               end: end
                  ? dayjs(end).format("HH:mm")
                  : supperEnd.format("HH:mm"),
               progress: 50,
            },
         ].filter((bar) => bar.start !== null || bar.label.includes("-")); // Exclude bars where `start` is null, but keep weekly bars

         const data = {
            labels: newCustomBars.map((bar) => bar.label),
            datasets: [
               {
                  label: "",
                  data: newCustomBars.map((bar) => [bar.start, bar.end]),
                  backgroundColor: "rgba(0,0,0,0)",
                  borderColor: "rgba(0,0,0,0)",
                  borderWidth: 0,
               },
            ],
         };

         const options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
               x: { beginAtZero: true },
               y: {
                  beginAtZero: false,
                  min: 0,
                  max: customTicks.length - 1,
                  ticks: {
                     stepSize: 300,
                     font: {
                        size: 10,
                     },
                     callback: (value: any) => {
                        if (customTicks[value]) {
                           return customTicks[value];
                        }
                        return "";
                     },
                  },
               },
            },
            animation: {
               onComplete: () => {
                  if (chartRef.current) {
                     const chart = chartRef.current.chartInstance;
                     updateCustomBars(chart, newCustomBars);
                  }
               },
            },
            plugins: {
               legend: { display: false },
               datalabels: {
                  display: false,
               },
               tooltip: {
                  enabled: true,
                  callbacks: {
                     label: function (tooltipItem: any) {
                        const { dataset, dataIndex } = tooltipItem;
                        const bar = newCustomBars[dataIndex]; // Берем нужный бар

                        return `С ${bar.start} до ${bar.end}`;
                     },
                  },
               },
            },
         };

         const myChart = new Chart(ctx, {
            type: "bar",
            data,
            options,
         });

         chartRef.current.chartInstance = myChart;
      }
   }, [start, end, isFasting, mealsTime]);

   const updateCustomBars = (chart: any, bars: any[]) => {
      const updatedBars = bars.map((bar) => {
         let startIdx = parseTime(bar.start);
         let endIdx = parseTime(bar.end);

         if (endIdx < startIdx) {
            endIdx += 24 * 60;
         }

         if (startIdx === -1 || endIdx === -1) return bar;

         const x = chart.scales.x.getPixelForValue(bar.label) - 15;
         const yEnd = chart.scales.y.getPixelForValue(endIdx);
         const yStart = chart.scales.y.getPixelForValue(startIdx);
         const height = yStart - yEnd;

         return { ...bar, x, y: yEnd, height };
      });

      setCustomBars(updatedBars);
   };

   return (
      <div
         style={{ position: "relative", width: "100%" }}
         className="h-[600px] max-lg:h-[500px] max-md:h-96 max-sm:h-60"
      >
         <canvas ref={chartRef} />
         {customBars.map((bar, index) => (
            <CustomBar key={index} {...bar} supperEnd={supperEnd} />
         ))}
      </div>
   );
};

export default CustomChart;
