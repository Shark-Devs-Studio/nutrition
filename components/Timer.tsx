"use client";
import React, { useEffect, useState } from "react";
import { IoSettingsOutline, IoTimerOutline } from "react-icons/io5";
import { Button } from "./ui/button";
import { useAtom } from "jotai";
import {
   fastingStartAtom,
   fastingEndAtom,
   isRunningAtom,
   fastingEndedAtom,
   userChangedTimeAtom,
   scheduledTimeAtom,
} from "@/lib/state";
import MuiTooltip from "./children/MuiTooltip";

const Timer = () => {
   const [start] = useAtom(fastingStartAtom);
   const [end] = useAtom(fastingEndAtom);
   const [isRunning, setIsRunning] = useAtom(isRunningAtom);
   const [fastingEnded, setFastingEnded] = useAtom(fastingEndedAtom);
   const [userChangedTime, setUserChangedTime] = useAtom(userChangedTimeAtom);
   const [scheduledTime] = useAtom(scheduledTimeAtom);

   const [timeLeft, setTimeLeft] = useState(0);
   const [totalDuration, setTotalDuration] = useState(0);
   const [bonus, setBonus] = useState(0);

   useEffect(() => {
      if (!isRunning || !start || !end) return;

      const updateTimer = () => {
         const now = new Date();
         const [startHours, startMinutes] = start.split(":").map(Number);
         const [endHours, endMinutes] = end.split(":").map(Number);
         const [scheduledHours, scheduledMinutes] = scheduledTime.startTime
            .split(":")
            .map(Number);

         let startTime = new Date(now);
         startTime.setHours(startHours, startMinutes, 0, 0);

         let endTime = new Date(now);
         endTime.setHours(endHours, endMinutes, 0, 0);

         // Если время окончания раньше начала, значит оно на следующий день
         if (endTime <= startTime) {
            endTime.setDate(endTime.getDate() + 1);
         }

         // Общее время голодания
         const total = Math.floor(
            (endTime.getTime() - startTime.getTime()) / 1000
         );
         setTotalDuration(total);

         // Если текущее время раньше старта, то таймер ещё не начался
         if (now < startTime) {
            setTimeLeft(total);
            return;
         }

         // Оставшееся время до конца голодания
         const diff = Math.max(
            0,
            Math.floor((endTime.getTime() - now.getTime()) / 1000)
         );
         setTimeLeft(diff);

         // Проверка на бонус (±30 минут от запланированного времени)
         let scheduledStartTime = new Date(startTime);
         scheduledStartTime.setHours(scheduledHours, scheduledMinutes, 0, 0);

         const timeDifference = Math.abs(
            startTime.getTime() - scheduledStartTime.getTime()
         );
         setBonus(timeDifference <= 30 * 60 * 1000 ? 250 : 0);
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
   }, [start, end, isRunning, scheduledTime]);

   const hours = Math.floor(timeLeft / 3600)
      .toString()
      .padStart(2, "0");
   const minutes = Math.floor((timeLeft % 3600) / 60)
      .toString()
      .padStart(2, "0");
   const seconds = (timeLeft % 60).toString().padStart(2, "0");

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
                  (макс = {Math.floor(totalDuration / 3600)} часа)
               </span>
            </p>
         </div>

         <div className="flex gap-10 justify-center items-center my-10 text-white">
            <MuiTooltip
               placement="top-start"
               title="Баллы за совпадение времени начала голодания с предыдущим днем ±30 мин"
            >
               <div className="flex items-center gap-2 max-sm:gap-0.5 rounded-full px-3 py-1.5 max-sm:py-1 max-sm:px-2 cursor-pointer bg-green">
                  <p className="text-xl max-md:text-base max-sm:text-sm gilroy-bold">
                     +{bonus}
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
                     strokeWidth="6"
                     strokeDasharray="282.6"
                     strokeDashoffset={progress}
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
                  {Math.floor(totalDuration / 3600)}/
                  {24 - Math.floor(totalDuration / 3600)}
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
