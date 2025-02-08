"use client";
import React, { useEffect, useState } from "react";
import { IoSettingsOutline, IoTimerOutline } from "react-icons/io5";
import { Button } from "./ui/button";
import { useAtom } from "jotai";
import {
   bonusPointsAtom,
   fastingEndAtom,
   fastingStartAtom,
   isFastingAtom,
   isTimerFinishedAtom,
   scheduledTimeAtom,
} from "@/lib/state";
import MuiTooltip from "./children/MuiTooltip";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { mealsTimeAtom } from "@/lib/state";

dayjs.extend(duration);

const Timer = () => {
   const [start] = useAtom(fastingStartAtom);
   const [end] = useAtom(fastingEndAtom);
   const [isFasting] = useAtom(isFastingAtom);
   const [mealsTime] = useAtom(mealsTimeAtom);
   const [scheduledTime] = useAtom(scheduledTimeAtom);
   const [isTimerFinished, setIsTimerFinished] = useAtom(isTimerFinishedAtom);
   const [bonusPoints, setBonusPoints] = useAtom(bonusPointsAtom);
   const [timeLeft, setTimeLeft] = useState("00:00:00");
   const [points, setPoints] = useState(0);
   const [timerPointsnts, setTimerPointsnts] = useState(0);

   const supperEnd = dayjs(mealsTime.supperRange[1], "HH:mm");

   const [progress, setProgress] = useState(0);

   useEffect(() => {
      if (isFasting && start) {
         const interval = setInterval(() => {
            const now = dayjs();

            const totalDuration = supperEnd.isBefore(start)
               ? supperEnd.add(1, "day").diff(start)
               : supperEnd.diff(start);

            const elapsedDuration = now.isBefore(start)
               ? now.add(1, "day").diff(start)
               : now.diff(start);

            const progressPercent = (elapsedDuration / totalDuration) * 100;
            setProgress(progressPercent);

            const timeLeftDuration = dayjs.duration(elapsedDuration);
            setTimeLeft(timeLeftDuration.format("HH:mm:ss"));

            const supperEndAdjusted = supperEnd.isBefore(start)
               ? supperEnd.add(1, "day")
               : supperEnd;

            if (now.isAfter(supperEndAdjusted)) {
               clearInterval(interval);
               setTimeLeft(dayjs.duration(totalDuration).format("HH:mm:ss"));
               setProgress(100);
               setIsTimerFinished(true);
               if (timerPointsnts === 0) {
                  setTimerPointsnts(250);
                  setBonusPoints(bonusPoints + 250);
               }
            }
         }, 1000);

         return () => clearInterval(interval);
      }
   }, [isFasting, start, supperEnd, isTimerFinished, setIsTimerFinished]);

   useEffect(() => {
      if (isFasting && start) {
         const scheduledStart = dayjs(scheduledTime.startTime, "HH:mm"); // Запланированное время
         const actualStart = dayjs(start); // Фактическое время

         const diffMinutes = Math.abs(
            scheduledStart.diff(actualStart, "minute")
         );

         if (diffMinutes <= 15) {
            setPoints(250);
            setBonusPoints((prev) => prev + 250);
         } else if (diffMinutes <= 30) {
            setPoints(200);
            setBonusPoints((prev) => prev + 200);
         } else {
            setPoints(0);
            setBonusPoints(bonusPoints + 0);
         }
      }
   }, [isFasting, start, scheduledTime.startTime]);

   useEffect(() => {
      if (!isFasting && start) {
         const now = dayjs();
         const elapsed = dayjs.duration(now.diff(start));
         setTimeLeft(elapsed.format("HH:mm:ss"));
      }
   }, [isFasting, start]);

   return (
      <div className="relative px-4 py-8 overflow-hidden">
         <div className="bg-blue h-full w-full absolute -z-10 -top-40 max-sm:-top-44 left-0 scale-125 max-sm:scale-150 rounded-b-[40%]" />
         <div className="text-white text-center">
            <h2 className="text-5xl max-xl:text-4xl max-sm:text-2xl gilroy-medium mb-1">
               Сейчас:
               <span className="gilroy-extraBold uppercase">
                  {isFasting ? " голодание" : " питание"}
               </span>
            </h2>
            <p className="text-2xl max-xl:text-xl max-sm:text-sm gilroy-regular">
               Вы голодаете: {timeLeft.slice(0, 5)}
               <span className="text-green ml-5 max-sm:ml-2">
                  (макс = 14 часа)
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
                     +{points}
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
                     strokeDashoffset={282.6 - (282.6 * progress) / 100}
                     transform="rotate(-90 50 50)"
                  />
               </svg>
               <div className="absolute text-center gilroy-extraBold">
                  <div className="text-6xl max-md:text-4xl max-sm:text-[34px] mt-5">
                     {timeLeft}
                  </div>

                  <MuiTooltip
                     placement="bottom"
                     title="Баллы за соблюдение длительности голодания"
                  >
                     <div className="mt-3 max-sm:mt-0 text-3xl max-md:text-2xl max-sm:text-lg text-green">
                        +{timerPointsnts} баллов
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

         {isTimerFinished && !end && (
            <p className="w-full text-3xl max-lg:text-2xl max-sm:text-lg text-center absolute bottom-36 max-sm:bottom-28 left-1/2 -translate-x-1/2 text-white">
               Ваше время голодания закончилось!
            </p>
         )}

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
