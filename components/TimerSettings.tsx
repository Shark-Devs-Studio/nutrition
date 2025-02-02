"use client";
import React, { useState, useEffect } from "react";
import CustomInput from "./children/CustomInput";
import { fastingStartAtom, fastingEndAtom } from "@/lib/state";
import { useAtom } from "jotai";
import MuiTooltip from "./children/MuiTooltip";

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
      <div className="flex items-center justify-center max-md:justify-around md:gap-14 sm:px-4 py-5 mt-0">
         <div className="max-md:w-40 max-sm:w-32 relative">
            <p className="text-xl max-md:text-base gilroy-medium">
               Начало | 26.08
            </p>
            {/* <MuiTooltip
               placement="top"
               title="Баллы за попадание начала гололдания в циркадный ритм"
            ></MuiTooltip> */}
            <CustomInput
               atom={fastingStartAtom}
               onTimeChange={handleStartTimeChange} // обновляем состояние
            />
            <p className="text-lg max-sm:text-sm mt-1 gilroy-regular">
               👍 Пн,
               <span className="text-black gilroy-medium"> 17:45 - 18:15</span>
            </p>
         </div>

         <div className="max-md:w-40 max-sm:w-32 relative">
            <p className="text-xl max-md:text-base gilroy-medium ">
               Конец | 26.08
            </p>
            {/* <MuiTooltip
               placement="top"
               title="Баллы за попадание начала гололдания в циркадный ритм"
            >
               </MuiTooltip> */}
            <CustomInput
               atom={fastingEndAtom}
               onTimeChange={handleEndTimeChange} // обновляем состояние
            />
            <p className="text-lg max-sm:text-sm mt-1 gilroy-regular">
               👍 Пн,
               <span className="text-black gilroy-medium"> 17:45 - 18:15</span>
            </p>
         </div>
      </div>
   );
};

export default TimerSettings;
