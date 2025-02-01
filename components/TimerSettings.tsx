"use client";
import React, { useState, useEffect } from "react";
import CustomInput from "./children/CustomInput";
import { fastingStartAtom, fastingEndAtom } from "@/lib/state";
import { useAtom } from "jotai";

const TimerSettings = () => {
   const [fastingStart, setFastingStart] = useAtom(fastingStartAtom);
   const [fastingEnd, setFastingEnd] = useAtom(fastingEndAtom);

   // Функция для обновления времени начала
   const handleStartTimeChange = (newStartTime: string) => {
      setFastingStart(newStartTime); // обновляем atom для начала голодания
   };

   // Функция для обновления времени конца
   const handleEndTimeChange = (newEndTime: string) => {
      setFastingEnd(newEndTime); // обновляем atom для конца голодания
   };

   return (
      <div className="flex items-center justify-center max-md:justify-around md:gap-14 sm:px-4 py-5 mt-16">
         <div className="max-md:w-40 max-sm:w-28 relative">
            <p className="text-xl max-md:text-base font-medium mb-2 max-sm:mb-1.5">
               Начало | 26.08
            </p>
            <CustomInput
               atom={fastingStartAtom}
               onTimeChange={handleStartTimeChange} // обновляем состояние
            />
         </div>

         <div className="max-md:w-40 max-sm:w-28 relative">
            <p className="text-xl max-md:text-base font-medium mb-2 max-sm:mb-1.5">
               Конец | 26.08
            </p>
            <CustomInput
               atom={fastingEndAtom}
               onTimeChange={handleEndTimeChange} // обновляем состояние
            />
         </div>
      </div>
   );
};

export default TimerSettings;
