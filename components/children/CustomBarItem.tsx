import React, { useCallback, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { dateAtom } from "@/lib/state";

interface CustomBarProps {
   x: number;
   y: number;
   height: number;
   supperEnd: string;
   dateStart: string;
   dateEnd: string;
   isDate: dayjs.Dayjs;
   setIsDate: (date: dayjs.Dayjs) => void;
   index: number;
   periods: {
      fastingPeroids: { previosPeriodEnd: string; newPeriodStart: string };
   };
}

const CustomBar: React.FC<CustomBarProps> = ({
   x,
   y,
   height,
   supperEnd,
   isDate,
   setIsDate,
   index,
   periods,
}) => {
   const start = periods.fastingPeroids.newPeriodStart;
   const end = periods.fastingPeroids.previosPeriodEnd;
   const tooltipRef = useRef<any>(null);
   const [offsetX, setOffsetX] = useState(40);
   const [currentProgress, setCurrentProgress] = useState(0);
   const time = dayjs(isDate).format("YYYY-MM-DD");
   const startTime = dayjs(start);
   let endTime = dayjs(end);
   const isLastThreeBars = index >= 7 - 4;

   if (endTime.isBefore(startTime)) {
      endTime = endTime.add(1, "day");
   }

   const durationHours = endTime.diff(startTime, "hour");
   const durationMinutes = endTime.diff(startTime, "minute") % 60;

   const calculateProgress = () => {
      if (end) return 100; // Если `end` есть, прогресс сразу 100%

      const currentTime = dayjs(); // Текущее время
      const startTime = dayjs(start); // `start` уже содержит дату
      let endTime = dayjs(
         `${startTime.format("YYYY-MM-DD")} ${supperEnd}`,
         "YYYY-MM-DD HH:mm"
      );

      // Если supperEnd — это время ПЕРЕД start (например, start = 23:30, supperEnd = 02:00)
      if (endTime.isBefore(startTime)) {
         endTime = endTime.add(1, "day"); // Добавляем 1 день
      }

      const totalDuration = endTime.diff(startTime, "minute"); // Длительность в минутах
      let elapsedTime = currentTime.diff(startTime, "minute"); // Сколько прошло

      return Math.min((elapsedTime / totalDuration) * 100, 100); // Процент выполнения
   };

   useEffect(() => {
      const interval = setInterval(() => {
         setCurrentProgress(calculateProgress());
      }, 1000);

      return () => clearInterval(interval);
   }, []);

   const updateOffsetX = useCallback(() => {
      const width = window.innerWidth;
      setOffsetX(
         width >= 1024 ? 40 : width >= 768 ? 25 : width >= 640 ? 17 : 1
      );
   }, []);

   useEffect(() => {
      updateOffsetX();
      window.addEventListener("resize", updateOffsetX);
      return () => window.removeEventListener("resize", updateOffsetX);
   }, [updateOffsetX]);

   return (
      <div
         className="w-28 max-lg:w-20 max-md:w-16 max-sm:w-8 group"
         style={{
            position: "absolute",
            left: `${x - offsetX}px`,
            top: `${y}px`,
            height: `${height}px`,
            transition: "0.3s",
            borderRadius: "100px",
         }}
      >
         {start && end && (
            <div
               ref={tooltipRef}
               className={`w-44 max-lg:w-40 max-md:w-[150px] absolute -top-5 left-1/2 ${
                  isLastThreeBars
                     ? "-translate-x-full opacity-0"
                     : "translate-x-0"
               } z-10 group-hover:opacity-100 opacity-0 gap-3 px-2 py-1 max-md:px-1 duration-300 rounded-[4px] pointer-events-none select-none bg-black/80 text-white`}
            >
               {/* <p className="text-xs max-lg:text-[10px] gilroy-bold lg:mb-1">
                  {label}
               </p> */}
               <div className="flex items-center gap-1 gilroy-regular">
                  <div
                     className="w-3 h-3 border border-white bg-blue"
                     style={{
                        backgroundColor:
                           time !== dayjs(start).format("YYYY-MM-DD")
                              ? "#4467e3"
                              : "#63db85",
                     }}
                  />
                  <p className="text-xs max-lg:text-[10px] max-md:leading-3">
                     с {dayjs(start).format("DD.MM")}
                  </p>
                  <p className="text-xs max-lg:text-[10px] max-md:leading-3">
                     по {dayjs(end).format("DD.MM")}:
                  </p>
                  <p className="text-xs max-lg:text-[10px] max-md:leading-3">
                     {durationHours} ч {durationMinutes} м
                  </p>
               </div>
            </div>
         )}
         {start && (
            <div
               className="h-full relative"
               onClick={() => setIsDate(dayjs(start))}
            >
               <p className="pointer-events-none select-none text-sm max-sm:text-[10px] gilroy-bold absolute -top-5 left-1/2 -translate-x-1/2 text-[#4467e3]">
                  {end !== null ? dayjs(end).format("HH:mm") : ""}
               </p>
               <div className="w-full h-full flex rounded-full overflow-hidden">
                  <div
                     className={`w-full mt-auto hover:cursor-pointer`}
                     style={{
                        height: `${currentProgress}%`,
                        backgroundColor:
                           time !== dayjs(start).format("YYYY-MM-DD")
                              ? "#4467e3"
                              : "#63db85",
                     }}
                  />
               </div>
               <p className="pointer-events-none select-none text-sm max-sm:text-[10px] gilroy-bold absolute -bottom-5 left-1/2 -translate-x-1/2 text-[#4467e3]">
                  {dayjs(start).format("HH:mm")}
               </p>
            </div>
         )}
      </div>
   );
};

export default CustomBar;
