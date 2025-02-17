"use client";
import { use, useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import dayjs from "dayjs";
import { addMinutes, eachMinuteOfInterval, format } from "date-fns";

import CustomBar from "./children/CustomBarItem";

import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   BarElement,
   Tooltip,
   Legend,
   Chart,
   BarController,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
   bonusPointsAtom,
   dateAtom,
   fastingEndAtom,
   fastingHoursAtom,
   fastingStartAtom,
   isFastingAtom,
   isTimerFinishedAtom,
   MOCK_API,
} from "@/lib/state";
import axios from "axios";

ChartJS.register(
   CategoryScale,
   LinearScale,
   BarElement,
   BarController,
   Tooltip,
   Legend,
   ChartDataLabels
);
const CustomChart = () => {
   const [fastingHours] = useAtom(fastingHoursAtom);

   const [isDate, setIsDate] = useAtom(dateAtom);
   const [start, setStart] = useAtom(fastingStartAtom);
   const [end, setEnd] = useAtom(fastingEndAtom);
   const [isFasting, setIsFasting] = useAtom(isFastingAtom);
   const [points] = useAtom(bonusPointsAtom);
   const chartRef = useRef<any>(null);
   const [customBars, setCustomBars] = useState<any[]>([]);

   const [isTimerFinished] = useAtom(isTimerFinishedAtom);

   // const supperEnd = dayjs(fastingHours[0].supperRange[1], "HH:mm");
   const supperEnd = start
      ? dayjs(start).add(fastingHours[0].starvation, "hour").format("HH:mm")
      : null;

   const startTime = new Date();
   startTime.setHours(9, 0, 0, 0);
   const endTime = addMinutes(startTime, 33 * 60);

   const toDay = dayjs().format("YYYY-MM-DD");

   const handleStartFasting = async () => {
      try {
         setIsFasting(true);
         setStart(dayjs());

         const patchRes = await axios.put(
            `${MOCK_API}/users/${toDay}`,
            {
               periods: {
                  fastingPeroids: {
                     previosPeriodEnd: null,
                     newPeriodStart: dayjs().format("YYYY-MM-DDTHH:mm"),
                  },
                  sleepPeriods: {
                     bedTime: null,
                     wakeUpTime: null,
                  },
               },
            }
         );

         console.log("Обновлено:", patchRes.data);
      } catch (error: any) {
         console.error("Ошибка:", error.response?.data || error.message);
      }
   };

   const handleEndFasting = async () => {
      try {
         setIsFasting(false);
         setEnd(dayjs());

         const patchRes = await axios.put(
            `${MOCK_API}/users/${toDay}`,
            {
               periods: {
                  fastingPeroids: {
                     previosPeriodEnd: dayjs().format("YYYY-MM-DDTHH:mm"),
                     newPeriodStart: dayjs(start).format("YYYY-MM-DDTHH:mm"),
                  },
                  sleepPeriods: {
                     bedTime: null,
                     wakeUpTime: null,
                  },
               },
            }
         );

         console.log("Обновлено:", patchRes.data);
      } catch (error: any) {
         console.error("Ошибка:", error.response?.data || error.message);
      }
   };

   useEffect(() => {
      setIsFasting(start && end ? false : true);
   }, [start, end, isFasting]);

   const customTicks = eachMinuteOfInterval(
      { start: startTime, end: endTime },
      { step: 1 }
   ).map((date) => format(date, "HH:mm"));

   const timeToIndex = (time: string) => customTicks.indexOf(time);
   const parseTime = (time: string | null) => {
      if (!time) return customTicks.length - 1;

      const parsedTime = new Date(`1982-01-01T${time}:00`);

      if (isNaN(parsedTime.getTime())) return customTicks.length - 1;

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
            {
               dateStart: "02.07.2024",
               dateEnd: "02.08.2025",
               label: "Пт-Вт",
               start: "20:22",
               end: "10:48",
               progress: 100,
            },
            {
               dateStart: "02.08.2025",
               dateEnd: "02.09.2025",
               label: "Вт-Ср",
               start: "23:00",
               end: "06:59",
               progress: 100,
            },
            {
               dateStart: "02.09.2025",
               dateEnd: "02.10.2025",
               label: "Ср-Чт",
               start: "21:00",
               end: "05:19",
               progress: 100,
            },
            {
               dateStart: "02.10.2025",
               dateEnd: "02.11.2025",
               label: "Чт-Пт",
               start: "01:11",
               end: "08:29",
               progress: 100,
            },
            {
               dateStart: "02.11.2025",
               dateEnd: "02.12.2025",
               label: "Пт-Сб",
               start: "20:00",
               end: "06:14",
               progress: 100,
            },
            {
               dateStart: "02.12.2025",
               dateEnd: "02.13.2025",
               label: "Сб-Вс",
               start: "22:00",
               end: "10:00",
               progress: 100,
            },
            {
               dateStart: "02.13.2025",
               dateEnd: "02.14.2025",
               label: "Вс-Пн",
               start: start ? dayjs(start).format("HH:mm") : null,
               end: end ? dayjs(end).format("HH:mm") : supperEnd,
               progress: end ? 100 : 50,
            },
         ].filter((bar) => bar.start !== null || bar.label.includes("-"));

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
               x: {
                  type: "category" as const,
                  beginAtZero: true,
               },
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
                        const { dataIndex } = tooltipItem;
                        const bar = newCustomBars[dataIndex];

                        if (bar) {
                           return `С ${bar.start} до ${bar.end}`;
                        }
                        return "";
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
   }, [start, end, isFasting]);

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
      <div className="w-full mt-5">
         <div className="max-w-7xl w-full mx-auto px-4 py-5">
            {isTimerFinished && !end && (
               <p className="text-[red] text-3xl max-lg:text-2xl max-sm:text-lg text-center mb-5">
                  Установите верное время окончания!
               </p>
            )}
            {start && !end ? (
               <button
                  onClick={handleEndFasting}
                  className={`w-full flex items-center justify-between py-5 px-10 max-sm:px-4 max-sm:py-3 rounded-xl text-white ${
                     isTimerFinished && !end ? "bg-[#c8c8c8] " : "bg-blue"
                  }`}
                  disabled={isTimerFinished && !end}
               >
                  <p className="text-3xl max-md:text-2xl max-sm:text-base gilroy-bold uppercase">
                     Завершить ГОЛОДАНИЕ
                  </p>
                  <p className="text-3xl max-sm:text-lg gilroy-extraBold text-shadow text-green">
                     +{points} баллов
                  </p>
               </button>
            ) : (
               <button
                  onClick={handleStartFasting}
                  className={`w-full flex items-center justify-between py-5 px-10 max-sm:px-4 max-sm:py-3 rounded-xl text-white ${
                     start && end ? "bg-[#c8c8c8] " : "bg-blue"
                  }`}
                  disabled={start !== null && end !== null}
               >
                  <p className="text-3xl max-md:text-2xl max-sm:text-base gilroy-bold uppercase">
                     Начать ГОЛОДАНИЕ
                  </p>
                  <p className="text-3xl max-sm:text-lg gilroy-extraBold text-shadow text-green">
                     +{points} баллов
                  </p>
               </button>
            )}
            <div className="mt-5">
               <div
                  style={{ position: "relative", width: "100%" }}
                  className="h-[600px] max-lg:h-[500px] max-md:h-96 max-sm:h-60"
               >
                  <canvas ref={chartRef} />
                  {customBars.map((bar, index) => (
                     <CustomBar
                        key={index}
                        index={index}
                        {...bar}
                        supperEnd={supperEnd}
                        isDate={isDate}
                        setIsDate={setIsDate}
                     />
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

export default CustomChart;
