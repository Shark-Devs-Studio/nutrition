"use client";
import React, { useEffect, useState } from "react";
import CustomInput from "./children/CustomInput";
import {
   fastingStartAtom,
   fastingEndAtom,
   isFastingAtom,
   isTimerFinishedAtom,
   bonusPointsAtom,
   settingsAtom,
} from "@/lib/state";
import { useAtom } from "jotai";
import axios from "axios";
import dayjs from "dayjs";

const TimerSettings = () => {
   const [settings, setSettings] = useAtom<{
      id: number;
      breackfastRange: string[];
      supperRange: string[];
   } | null>(settingsAtom);
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
               circadianRhythm={"18:00"}
               time={fastingStart}
               range={settings?.breackfastRange}
               disabled={false}
               status={false}
               setPoints={setPoints}
               points={points}
            />

            <CustomInput
               placeholder={InpPlaceholderEnd}
               title={"Конец"}
               circadianRhythm={"09:00"}
               getTime={setFastingEnd}
               time={fastingEnd}
               range={settings?.supperRange}
               disabled={!isTimerFinished && !fastingEnd}
               status={isTimerFinished && !fastingEnd}
               setPoints={setPoints}
               points={points}
            />
         </div>
      </div>
   );
};

export default TimerSettings;
