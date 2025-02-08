"use client";
import React from "react";
import CustomInput from "./children/CustomInput";
import {
   fastingStartAtom,
   fastingEndAtom,
   isFastingAtom,
   mealsTimeAtom,
   isTimerFinishedAtom,
   bonusPointsAtom,
} from "@/lib/state";
import { useAtom } from "jotai";

const TimerSettings = () => {
   const [fastingStart, setFastingStart] = useAtom(fastingStartAtom);
   const [fastingEnd, setFastingEnd] = useAtom(fastingEndAtom);
   const [isFasting, setIsFasting] = useAtom(isFastingAtom);
   const [mealsTime] = useAtom(mealsTimeAtom);
   const [isTimerFinished, setIsTimerFinished] = useAtom(isTimerFinishedAtom);
   const [points, setPoints] = useAtom(bonusPointsAtom);

   return (
      <div className="flex flex-col items-center justify-center gap-4 py-5">
         <div className="flex gap-10">
            <CustomInput
               title={"Начало"}
               getTime={() => {}}
               circadianRhythm={"18:00"}
               time={fastingStart}
               range={mealsTime.breakfastRange}
               disabled={false}
               status={false}
               setPoints={setPoints}
               points={points}
            />

            <CustomInput
               title={"Конец"}
               circadianRhythm={"09:00"}
               getTime={setFastingEnd}
               time={fastingEnd}
               range={mealsTime.supperRange}
               disabled={!isTimerFinished}
               status={isTimerFinished && !fastingEnd}
               setPoints={setPoints}
               points={points}
            />
         </div>
      </div>
   );
};

export default TimerSettings;
