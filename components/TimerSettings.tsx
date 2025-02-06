"use client";
import React from "react";
import CustomInput from "./children/CustomInput";
import {
   fastingStartAtom,
   fastingEndAtom,
   isFastingAtom,
   mealsTimeAtom,
   isTimerFinishedAtom,
} from "@/lib/state";
import { useAtom } from "jotai";

const TimerSettings = () => {
   const [fastingStart, setFastingStart] = useAtom(fastingStartAtom);
   const [fastingEnd, setFastingEnd] = useAtom(fastingEndAtom);
   const [isFasting, setIsFasting] = useAtom(isFastingAtom);
   const [mealsTime] = useAtom(mealsTimeAtom);
   const [isTimerFinished, setIsTimerFinished] = useAtom(isTimerFinishedAtom);

   return (
      <div className="flex flex-col items-center justify-center gap-4 py-5">
         <div className="flex gap-10">
            {/* Начало голодания */}
            <div className="w-40 relative">
               <p className="text-xl gilroy-medium">Начало | 26.08</p>
               <CustomInput
                  getTime={() => {}}
                  time={fastingStart}
                  range={mealsTime.breakfastRange}
                  value={fastingStart || ""}
                  disabled={false}
                  status={false}
               />
               <p className="text-lg max-sm:text-sm mt-1 gilroy-regular">
                  👍 Пн,
                  <span className="text-black gilroy-medium">
                     17:45 - 18:15
                  </span>
               </p>
            </div>

            <div className="w-40 relative">
               <p className="text-xl gilroy-medium">Конец | 27.08</p>
               <CustomInput
                  getTime={setFastingEnd}
                  time={fastingEnd}
                  range={mealsTime.supperRange}
                  value={fastingEnd || ""}
                  disabled={!isTimerFinished}
                  status={isTimerFinished && !fastingEnd}
               />
               <p className="text-lg max-sm:text-sm mt-1 gilroy-regular">
                  👍 Пн,
                  <span className="text-black gilroy-medium">
                     17:45 - 18:15
                  </span>
               </p>
            </div>
         </div>
      </div>
   );
};

export default TimerSettings;
