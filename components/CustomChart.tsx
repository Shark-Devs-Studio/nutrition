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
   userCourseAtom,
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
   const [userCourse, setUserCourse] = useAtom(userCourseAtom);
   const [fastingHours] = useAtom(fastingHoursAtom);
   const [isDate, setIsDate] = useAtom(dateAtom);
   const [start, setStart] = useAtom(fastingStartAtom);
   const [end, setEnd] = useAtom(fastingEndAtom);
   const [isFasting, setIsFasting] = useAtom(isFastingAtom);
   const [points] = useAtom(bonusPointsAtom);
   const chartRef = useRef<any>(null);
   const [customBars, setCustomBars] = useState<any[]>([]);
   const [isTimerFinished] = useAtom(isTimerFinishedAtom);

   const supperEnd = start
      ? dayjs(start).add(fastingHours[0].starvation, "hour").format("HH:mm")
      : null;

   const startTime = new Date();
   startTime.setHours(9, 0, 0, 0);
   const endTime = addMinutes(startTime, 33 * 60);

   const toDay = dayjs().format("YYYY-MM-DD");

   const handleStartFasting = async () => {
      try {
         await axios
            .put(`${MOCK_API}/userCourseDaysData/${toDay}`, {
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
            })
            .then((res) => {
               if (res.status === 200 || res.status === 201) {
                  setIsFasting(true);
                  setStart(dayjs());
               }
            });
      } catch (error: any) {
         console.error("Ошибка:", error.response?.data || error.message);
      }
   };

   const handleEndFasting = async () => {
      try {
         await axios
            .put(`${MOCK_API}/userCourseDaysData/${toDay}`, {
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
            })
            .then((res) => {
               if (res.status === 200 || res.status === 201) {
                  setIsFasting(false);
                  setEnd(dayjs());
               }
            });
      } catch (error: any) {
         console.error("Ошибка:", error.response?.data || error.message);
      }
   };

   useEffect(() => {
      axios.get(`${MOCK_API}/userCourseDaysData`).then((res) => {
         if (res.status === 200 || res.status === 201) {
            setUserCourse(res.data);
         }
      });
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

         const data = {
            labels: userCourse.map(
               (bar: any) => dayjs(bar.id).format("dd")
               // `${dayjs(bar.periods.fastingPeroids.newPeriodStart).format(
               //    "dd"
               // )}-${dayjs(
               //    bar.periods.fastingPeroids.previosPeriodEnd
               // ).add(1, "day").format("dd")}`
            ),
            datasets: [
               {
                  label: "",
                  data: userCourse.map((bar: any) => [
                     [
                        dayjs(
                           bar?.periods.fastingPeroids.newPeriodStart
                        ).format("HH:mm"),
                        dayjs(
                           bar?.periods.fastingPeroids.previosPeriodEnd
                        ).format("HH:mm"),
                     ],
                  ]),
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
                  if (chartRef.current && userCourse.length > 0) {
                     const chart = chartRef.current.chartInstance;
                     updateCustomBars(chart, userCourse);
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
                        const bar: any = userCourse[dataIndex];

                        if (bar) {
                           return `С ${bar.periods.fastingPeroids.newPeriodStart} до ${bar.p}`;
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
   }, [start, end, isFasting, userCourse]);

   const updateCustomBars = (chart: any, bars: any[]) => {
      const updatedBars = bars.map((bar) => {
         const start = bar.periods.fastingPeroids.newPeriodStart;
         const end = bar.periods.fastingPeroids.previosPeriodEnd;
         let startIdx = parseTime(dayjs(start).format("HH:mm"));
         let endIdx = parseTime(
            start && !end ? supperEnd : dayjs(end).format("HH:mm")
         );

         if (endIdx < startIdx) {
            endIdx += 24 * 60;
         }

         if (startIdx === -1 || endIdx === -1) return bar;

         const x =
            chart.scales.x.getPixelForValue(dayjs(bar.id).format("dd")) - 15;
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
                  {customBars.map((bar: any, index) => (
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
