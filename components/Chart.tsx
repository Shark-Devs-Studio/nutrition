import React from "react";
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend
);

const chartOptions = {
   responsive: true,
   plugins: {
      legend: {
         display: false,
      },
      tooltip: {
         callbacks: {
            label: function (context: any) {
               const start = context.raw[0];
               const end = context.raw[1];
               return `с: ${formatTime(start)}, по: ${formatTime(end)}`;
            },
         },
      },
   },
   scales: {
      x: {
         grid: {
            display: false,
         },
      },
      y: {
         grid: {
            color: "#e5e7eb",
         },
         ticks: {
            callback: function (value: any) {
               return `${value}:00`;
            },
         },
         min: 9,
         max: 18,
         stepSize: 1,
      },
   },
};

const chartData = {
   labels: ["Ср-Чт", "Чт-Пт", "Пт-Сб", "Сб-Вс", "Вс-Пн", "Пн-Вт", "Вт-Ср"],
   datasets: [
      {
         label: "Голодание",
         data: [
            [11, 16.5],
            [11, 16],
            [11, 18],
            [11.5, 17.5],
            [12, 18],
            [9, 15],
            [10, 17],
         ],
         backgroundColor: "#2563eb",
         borderRadius: 100,
         borderSkipped: false,
      },
   ],
};

function formatTime(value: number): string {
   const hours = Math.floor(value);
   const minutes = Math.round((value % 1) * 60);
   return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
}

const Chart = () => {
   return <Bar className="chart m-[1px]" options={chartOptions} data={chartData} />;
};

export default Chart;
