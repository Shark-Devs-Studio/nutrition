"use client";
import { Bar } from "react-chartjs-2";
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   BarElement,
   Tooltip,
   Legend,
} from "chart.js";
import { useRef } from "react";
import { format, addMinutes, eachMinuteOfInterval } from "date-fns";
import ChartDataLabels from "chartjs-plugin-datalabels"; // импортируем плагин
import { fastingEndAtom, fastingStartAtom } from "@/lib/state";

ChartJS.register(
   CategoryScale,
   LinearScale,
   BarElement,
   Tooltip,
   Legend,
   ChartDataLabels
);

const startTime = new Date();
startTime.setHours(9, 0, 0, 0);

const endTime = addMinutes(startTime, 33 * 60);

const customTicks = eachMinuteOfInterval(
   { start: startTime, end: endTime },
   { step: 1 }
).map((date) => format(date, "HH:mm"));

const timeToIndex = (time: string) => customTicks.indexOf(time);

const parseTime = (time: string) => {
   const parsedTime = new Date(`1982-01-01T${time}:00`);
   const formattedTime = format(parsedTime, "HH:mm");

   const index = timeToIndex(formattedTime);

   return index !== -1 ? index : customTicks.length - 1;
};

const currentTime = format(new Date(), "HH:mm");

const effectiveFastingEnd =
   currentTime > fastingEndAtom.init.toString()
      ? fastingEndAtom.init.toString()
      : currentTime;

const data = [
   { day: "Ср-Чт", start: "20:08", end: "12:44" },
   { day: "Чт-Пт", start: "20:08", end: "13:22" },
   { day: "Пт-Сб", start: "21:08", end: "13:24" },
   { day: "Сб-Вс", start: "20:05", end: "11:35" },
   { day: "Вс-Пн", start: "21:22", end: "11:55" },
   { day: "Пн-Вт", start: "20:05", end: "11:35" },
   {
      day: "Вт-Ср",
      start: fastingStartAtom.init.toString(),
      end: effectiveFastingEnd,
      color: "green",
   },
];

const formattedData = data.map((d) => {
   let startIdx = parseTime(d.start);
   let endIdx = parseTime(d.end);

   if (endIdx < startIdx) {
      endIdx += 24 * 60;
   }

   return {
      x: d.day,
      y: [startIdx, endIdx],
   };
});

// Данные для графика
const chartData = {
   labels: ["Ср-Чт", "Чт-Пт", "Пт-Сб", "Сб-Вс", "Вс-Пн", "Пн-Вт", "Вт-Ср"],
   datasets: [
      {
         label: "Временные интервалы",
         data: formattedData,
         backgroundColor: [
            "#4467e3",
            "#4467e3",
            "#4467e3",
            "#4467e3",
            "#4467e3",
            "#4467e3",
            "#63db85",
         ],
         borderRadius: 100,
         borderSkipped: false,
         barPercentage: 0.5,
         categoryPercentage: 1.5,
      },
   ],
};

const options: any = {
   indexAxis: "x" as const,
   scales: {
      x: {
         type: "category" as const,
         grid: { display: true },
      },
      y: {
         type: "linear" as const,
         min: 0,
         max: customTicks.length - 1,
         ticks: {
            stepSize: 300,
            font: {
               size: 10,
            },
            callback: (value: number) => {
               if (customTicks[value]) {
                  return customTicks[value];
               }
               return "";
            },
         },
         grid: { drawBorder: true },
      },
   },
   plugins: {
      legend: { display: false },
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
      datalabels: {
         display: true,
         color: "#4467e3",
         font: {
            size: 10,
            weight: "bold",
         },
         clip: false,
         formatter: (value: any, context: any) => {
            const { datasetIndex, dataIndex } = context;
            const { y } = chartData.datasets[datasetIndex].data[dataIndex];

            const startTime = customTicks[y[0]];
            const endTime = customTicks[y[1] % customTicks.length];

            return datasetIndex === 0 ? startTime : endTime;
         },
         align: (context: any) =>
            context.datasetIndex === 0 ? "end" : "start",
         anchor: (context: any) =>
            context.datasetIndex === 0 ? "start" : "end",
         offset: (context: any) => (context.datasetIndex === 0 ? -20 : 20),
      },
   },
};

export default function FloatingBarChart() {
   const chartRef = useRef(null);

   return (
      <div className="w-full">
         <div className="max-w-7xl w-full mx-auto px-4 py-5">
            <div className="flex items-center justify-between py-5 px-10 max-sm:p-4 rounded-xl text-white bg-blue">
               <p className="text-3xl max-md:text-2xl max-sm:text-base font-semibold uppercase">
                  Завершить ГОЛОДАНИЕ
               </p>
               <p className="text-3xl max-sm:text-lg font-medium text-green">
                  +0 баллов
               </p>
            </div>
            <div className="mt-5">
               <Bar
                  className="chart m-[1px]"
                  ref={chartRef}
                  data={chartData}
                  options={options}
               />
            </div>
         </div>
      </div>
   );
}
