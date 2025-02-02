"use client";
import React, { useEffect, useState } from "react";
import { IoSettingsOutline, IoTimerOutline } from "react-icons/io5";
import { Button } from "./ui/button";
import { useAtom } from "jotai";
import { fastingStartAtom, fastingEndAtom } from "@/lib/state";
import MuiTooltip from "./children/MuiTooltip";

const Timer = () => {
   const [start] = useAtom(fastingStartAtom);
   const [end] = useAtom(fastingEndAtom);
   const [timeLeft, setTimeLeft] = useState(0);
   const [totalDuration, setTotalDuration] = useState(0);
   // const [open, setOpen] = useState(false);
   // const [tooltip, setTooltip] = useState(false);

   // const handleTooltipOpen = () => {
   //    setOpen(true);
   // };
   // const handleTooltipOpen2 = () => {
   //    setTooltip(true);
   // };

   useEffect(() => {
      const [startHours, startMinutes] = start.split(":").map(Number);
      const [endHours, endMinutes] = end.split(":").map(Number);

      const startTimeInMinutes = startHours * 60 + startMinutes;
      let endTimeInMinutes = endHours * 60 + endMinutes;

      // Если время окончания раньше времени начала, значит оно на следующий день
      if (endTimeInMinutes < startTimeInMinutes) {
         endTimeInMinutes += 1440; // добавляем 24 часа в минутах
      }

      const timeDifference = endTimeInMinutes - startTimeInMinutes;

      setTimeLeft(timeDifference * 60);
      setTotalDuration(timeDifference * 60);

      const interval = setInterval(() => {
         setTimeLeft((prevTime) => {
            if (prevTime <= 0) {
               clearInterval(interval);
               return 0;
            }
            return prevTime - 1;
         });
      }, 1000);

      return () => clearInterval(interval);
   }, [start, end]);

   // Преобразуем оставшееся время в формат ЧЧ:ММ:СС
   const hours = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
   const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
   const seconds = String(timeLeft % 60).padStart(2, "0");

   // Расчёт прогресса
   const progress = totalDuration > 0 ? (timeLeft / totalDuration) * 282.6 : 0;

   return (
      <div className="relative px-4 py-8 overflow-hidden">
         <div className="bg-blue h-full w-full absolute -z-10 -top-40 max-sm:-top-44 left-0 scale-125 max-sm:scale-150 rounded-b-[40%]" />
         <div className="text-white text-center">
            <h2 className="text-5xl max-xl:text-4xl max-sm:text-2xl gilroy-medium mb-1">
               Сейчас: <span className="gilroy-extraBold">ГОЛОДАНИЕ</span>
            </h2>
            <p className="text-2xl max-xl:text-xl max-sm:text-sm gilroy-regular">
               Вы голодаете: {hours}:{minutes}
               <span className="text-green ml-5 max-sm:ml-2">
                  (макс = {totalDuration / 3600} часа)
               </span>
            </p>
         </div>

         <div className="flex gap-10 justify-center items-center my-10 text-white">
            <MuiTooltip
               placement="top-start"
               title="Баллы за совпадение времени начала гололдания с предыдущим днем ±30 мин"
            >
               <div className="flex items-centers gap-2 max-sm:gap-0.5 rounded-full px-3 py-1.5 max-sm:py-1 max-sm:px-2 cursor-pointer bg-green">
                  <p className="text-xl max-md:text-base max-sm:text-sm gilroy-bold">
                     +250
                  </p>
                  <IoTimerOutline className="text-[25px] max-sm:text-[18px]" />
               </div>
            </MuiTooltip>

            <div className="relative flex items-center justify-center w-96 h-96 max-md:w-80 max-md:h-80 max-sm:w-52 max-sm:h-40">
               <svg
                  className="absolute w-80 h-80 max-md:w-60 max-md:h-60 max-sm:w-52 max-sm:h-52 max-[475px]:w-48 max-[475px]:h-48"
                  viewBox="0 0 100 100"
               >
                  <circle
                     cx="50"
                     cy="50"
                     r="45"
                     fill="none"
                     stroke="#ffffff99"
                     strokeWidth="2"
                  />
                  <circle
                     cx="50"
                     cy="50"
                     r="45"
                     fill="none"
                     stroke="#4ade80"
                     strokeWidth="8"
                     strokeDasharray="282.6"
                     strokeDashoffset={progress} // Отображаем прогресс
                     transform="rotate(-90 50 50)"
                  />
               </svg>
               <div className="absolute text-center gilroy-extraBold">
                  <div className="text-6xl max-md:text-4xl max-sm:text-[34px] mt-5">
                     {hours}:{minutes}:{seconds}
                  </div>

                  <MuiTooltip
                     placement="bottom"
                     title="Баллы за соблюдение длительности голодания"
                  >
                     <div className="mt-3 max-sm:mt-0 text-3xl max-md:text-2xl max-sm:text-lg text-green">
                        +0 баллов
                     </div>
                  </MuiTooltip>
               </div>
            </div>

            <div className="flex items-center gap-2 max-sm:gap-0.5 rounded-full px-3 py-1.5 max-sm:py-1 max-sm:px-2 bg-green">
               <p className="text-xl max-md:text-base max-sm:text-sm gilroy-bold">
                  14/10
               </p>
               <IoSettingsOutline className="text-[25px] max-sm:text-[18px]" />
            </div>
         </div>

         <div className="mx-auto flex w-fit max-sm:mt-16">
            <Button className="relative text-2xl max-sm:text-xl px-10 py-10 max-sm:py-8 max-sm:px-10 rounded-t-3xl rounded-b-[100px] border border-white text-white bg-blue">
               <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-base max-sm:text-sm gilroy-medium rounded-full bg-green">
                  стадия
               </span>
               Сжигание жира
               <span className="-translate-x-1 -translate-y-2.5 px-2 text-sm gilroy-bold rounded-full border-2 border-white">
                  !
               </span>
            </Button>
         </div>
      </div>
   );
};

export default Timer;
