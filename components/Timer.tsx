"use client";
import React, { useEffect, useState } from "react";
import { IoSettingsOutline, IoTimerOutline } from "react-icons/io5";
import { Button } from "./ui/button";
import { useAtom } from "jotai";
import {
   bonusPointsAtom,
   fastingEndAtom,
   fastingHoursAtom,
   fastingStartAtom,
   isEatingAtom,
   isFastingAtom,
   isTimerFinishedAtom,
   MOCK_API,
   scheduledTimeAtom,
   userCourseAtom,
} from "@/lib/state";
import MuiTooltip from "./children/MuiTooltip";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import axios from "axios";
import Link from "next/link";

dayjs.extend(duration);

const Timer = () => {
   const [userCourse, setUserCourse] = useAtom(userCourseAtom);
   const [start, setStart] = useAtom(fastingStartAtom);
   const [isEatingTime, setIsEatingTime] = useState(true);
   const [end, setEnd] = useAtom(fastingEndAtom);
   const [isFasting] = useAtom(isFastingAtom);
   const [isEating, setIsEating] = useAtom(isEatingAtom);
   const [fastingHours] = useAtom(fastingHoursAtom);
   const [scheduledTime, setScheduledTime] = useAtom(scheduledTimeAtom);
   const [isTimerFinished, setIsTimerFinished] = useAtom(isTimerFinishedAtom);
   const [bonusPoints, setBonusPoints] = useAtom(bonusPointsAtom);
   const [timeLeft, setTimeLeft] = useState("00:00:00");
   const [eatingTime, setEatingTime] = useState("00:00:00");
   const [points, setPoints] = useState(0);
   const [timerPoints, setTimerPoints] = useState(0);
   const [eatingDuration, setEatingDuration] = useState(
      24 - fastingHours[0]?.starvation
   );
   const [formattedTime, setFormattedTime] = useState<string | null>(null);

   const toDay = dayjs().format("YYYY-MM-DD");

   const [progress, setProgress] = useState(0);

   useEffect(() => {
      if (!isFasting && end) {
         setIsEatingTime(true);
         const interval = setInterval(() => {
            const now = dayjs();
            const eatingTime = end.add(eatingDuration, "hour");

            const elapsedDuration = now.diff(end);
            const totalDuration = eatingTime.diff(end);

            const progressPercent = (elapsedDuration / totalDuration) * 100;
            setProgress(progressPercent);

            const timePassedDuration = dayjs.duration(elapsedDuration);
            setEatingTime(timePassedDuration.format("HH:mm:ss"));

            if (now.isAfter(eatingTime)) {
               clearInterval(interval);
               // setEatingTime(`${eatingDuration} часов`);
               setProgress(100);
            }
         }, 1000);

         return () => clearInterval(interval);
      }
   }, [isFasting, end]);

   useEffect(() => {
      if (isFasting && start && !end) {
         setIsEatingTime(false);
         const interval = setInterval(() => {
            const now = dayjs();
            const fastingEnd = start.add(fastingHours[0]?.starvation, "hour"); // Таймер должен идти вперед 16 часов

            const elapsedDuration = now.diff(start);
            const totalDuration = fastingEnd.diff(start);

            const progressPercent = (elapsedDuration / totalDuration) * 100;
            setProgress(progressPercent);

            // Теперь показываем прошедшее время с начала голодания
            const timePassedDuration = dayjs.duration(elapsedDuration);
            setTimeLeft(timePassedDuration.format("HH:mm:ss"));

            if (now.isAfter(fastingEnd)) {
               clearInterval(interval);
               setTimeLeft(`${fastingHours[0]?.starvation} часов`);
               setProgress(100);
               setIsTimerFinished(true);
               if (timerPoints === 0) {
                  setTimerPoints(250);
                  setBonusPoints(bonusPoints + 250);

                  axios.patch(`${MOCK_API}/userCourseDaysData/${toDay}`, {
                     tasksPoints: {
                        nutritionPoints: 250,
                        morningExrPoints: null,
                        trainingPoints: null,
                        stepsPoints: null,
                        waterPoints: null,
                        sleepPoints: null,
                        knowledgePoints: null,
                     },
                  });
               }
            }
         }, 1000);

         return () => clearInterval(interval);
      }
   }, [isFasting, start, isTimerFinished, setIsTimerFinished]);

   useEffect(() => {
      if (isFasting && start) {
         const scheduledStart = dayjs(scheduledTime, "HH:mm");
         const actualStart = dayjs(start);

         const diffMinutes = Math.abs(
            scheduledStart.diff(actualStart, "minute")
         );

         if (diffMinutes <= 30) {
            setPoints(250);
            setBonusPoints((prev) => prev + 250);
         }
      }
   }, [isFasting, start, scheduledTime]);

   useEffect(() => {
      if (!isFasting && start) {
         const now = dayjs();
         const elapsed = dayjs.duration(now.diff(start));
         setTimeLeft(elapsed.format("HH:mm:ss"));
      }
   }, [isFasting, start]);

   useEffect(() => {
      const toDay = dayjs().format("YYYY-MM-DD");
      const previousDay = dayjs(toDay).subtract(1, "day").format("YYYY-MM-DD");

      userCourse.forEach((user: any) => {
         if (user.id === toDay) {
            setStart(
               user.periods.fastingPeroids.newPeriodStart
                  ? dayjs(user.periods.fastingPeroids.newPeriodStart)
                  : null
            );
            setEnd(
               user.periods.fastingPeroids.previosPeriodEnd
                  ? dayjs(user.periods.fastingPeroids.previosPeriodEnd)
                  : null
            );
         }

         if (user.id === previousDay) {
            setScheduledTime(
               dayjs(user.periods.fastingPeroids.newPeriodStart).format("HH:mm")
            );
         }
      });
   }, []);

   useEffect(() => {
      if (start && end) {
         const duration = dayjs.duration(dayjs(end).diff(dayjs(start)));
         setTimeLeft(duration.format("HH:mm:ss"));
      }
   }, [start, end]);

   useEffect(() => {
      const time =
         start && !end
            ? dayjs(timeLeft, "HH:mm").format("HH:mm")
            : dayjs(eatingTime, "HH:mm").format("HH:mm");

      setFormattedTime(time);
   }, [start, timeLeft, eatingTime]);

   return (
      <>
         <div className="relative px-4 py-8 overflow-hidden">
            <div
               className={`h-full w-full absolute -z-10 -top-40 max-sm:-top-44 left-0 scale-125 max-sm:scale-150 rounded-b-[40%] ${
                  start && !end
                     ? "bg-blue"
                     : "bg-[url('/images/vegetables.jpg')] bg-cover brightness-50"
               }`}
            />
            <div className="text-white text-center">
               <h2 className="text-5xl max-xl:text-4xl max-sm:text-2xl gilroy-medium mb-1">
                  Сейчас:
                  <span className="gilroy-extraBold uppercase">
                     {start && !end ? " голодание" : " питание"}
                  </span>
               </h2>
               <p className="text-2xl max-xl:text-xl max-sm:text-sm gilroy-regular">
                  Вы {isFasting ? "голодаете" : "питаетесь"}:{" "}
                  <span>{formattedTime}</span>
                  <span className="text-green ml-5 max-sm:ml-2">
                     (макс ={" "}
                     {isFasting ? fastingHours[0]?.starvation : eatingDuration}{" "}
                     часа)
                  </span>
               </p>
            </div>

            <div className="flex gap-10 justify-center items-center mb-24 mt-10 text-white">
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
                        {isFasting ? timeLeft : eatingTime}
                     </div>

                     <MuiTooltip
                        placement="bottom"
                        title="Баллы за соблюдение длительности голодания"
                     >
                        <div className="mt-3 max-sm:mt-0 text-3xl max-md:text-2xl max-sm:text-lg text-green">
                           +{timerPoints} баллов
                        </div>
                     </MuiTooltip>
                  </div>
               </div>

               <Link
                  href={"/settings"}
                  className="flex items-center gap-2 max-sm:gap-0.5 rounded-full px-3 py-1.5 max-sm:py-1 max-sm:px-2 bg-green"
               >
                  <p className="text-xl max-md:text-base max-sm:text-sm gilroy-bold">
                     {fastingHours[0]?.starvation}/
                     {fastingHours[0]?.starvation
                        ? 24 - fastingHours[0]?.starvation
                        : "0"}
                  </p>
                  <IoSettingsOutline className="text-[25px] max-sm:text-[18px]" />
               </Link>
            </div>

            {isTimerFinished && !end && (
               <p className="w-full text-3xl max-lg:text-2xl max-sm:text-lg text-center absolute bottom-36 max-sm:bottom-28 left-1/2 -translate-x-1/2 text-white">
                  Ваше время голодания закончилось!
               </p>
            )}
         </div>
         {isEatingTime && (
            <p className="text-center">Новое голодание начнется:</p>
         )}
      </>
   );
};

export default Timer;
