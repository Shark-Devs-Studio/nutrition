"use client";
import React, { useEffect, useState } from "react";
import CustomInput from "./children/CustomInput";
import {
   fastingStartAtom,
   fastingEndAtom,
   isFastingAtom,
   isTimerFinishedAtom,
   bonusPointsAtom,
   fastingHoursAtom,
} from "@/lib/state";
import { useAtom } from "jotai";
import axios from "axios";
import dayjs from "dayjs";

const TimerSettings = () => {
   const [fastingHours] = useAtom(fastingHoursAtom);

   const [fastingStart, setFastingStart] = useAtom(fastingStartAtom);
   const [fastingEnd, setFastingEnd] = useAtom(fastingEndAtom);
   const [isFasting, setIsFasting] = useAtom(isFastingAtom);
   const [isTimerFinished, setIsTimerFinished] = useAtom(isTimerFinishedAtom);
   const [points, setPoints] = useAtom(bonusPointsAtom);

   const [InpPlaceholderStart, setInpPlaceholderStart] =
      useState<dayjs.Dayjs | null>(dayjs());
   const [InpPlaceholderEnd, setInpPlaceholderEnd] =
      useState<dayjs.Dayjs | null>(null);

   useEffect(() => {
      const interval = setInterval(() => {
         setInpPlaceholderStart(dayjs());
         if (fastingStart) {
            setInpPlaceholderEnd(dayjs());
         }
      }, 1000);
      return () => clearInterval(interval);
   }, [fastingStart]);

   return (
      <div className="flex flex-col items-center justify-center gap-4 py-5">
         <div className="flex gap-10">
            <CustomInput
               placeholder={InpPlaceholderStart}
               title={"Начало"}
               getTime={() => {}}
               time={fastingStart}
               timeUser={fastingHours[0]?.startTimeUser}
               window={fastingHours[0]?.durationWindow}
               disabled={false}
               status={false}
               setPoints={setPoints}
               points={points}
               week={dayjs().format("dd")}
            />

            <CustomInput
               placeholder={InpPlaceholderEnd}
               title={"Конец"}
               getTime={setFastingEnd}
               time={fastingEnd}
               timeUser={fastingHours[0]?.endTimeUser}
               window={fastingHours[0]?.durationWindow}
               disabled={!isTimerFinished && !fastingStart}
               status={isTimerFinished && !fastingEnd}
               setPoints={setPoints}
               points={points}
               week={dayjs().add(1, "day").format("dd")}
            />
         </div>
      </div>
   );
};

export default TimerSettings;
