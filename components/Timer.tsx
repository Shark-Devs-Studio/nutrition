import React from "react";
import { IoSettingsOutline, IoTimerOutline } from "react-icons/io5";
import { Button } from "./ui/button";

const Timer = () => {
   return (
      <div className="relative bg-blue-600 rounded-b-[45%] max-md:rounded-b-[35%] px-4 py-5">
         <div className="text-white text-center">
            <h2 className="text-5xl max-xl:text-4xl max-sm:text-2xl mb-5">
               Сейчас: <span className="font-bold">ГОЛОДАНИЕ</span>
            </h2>
            <p className="text-2xl max-xl:text-xl max-sm:text-sm">
               Вы голодаете: 15:00
               <span className="text-green-400 ml-5 max-sm:ml-2">
                  (макс = 14 часов)
               </span>
            </p>
         </div>

         <div className="flex gap-10 justify-center items-center my-10 text-white">
            <div className="flex items-center gap-2 max-sm:gap-0.5 rounded-full px-3 py-1.5 max-sm:px-2 bg-green-400">
               <p className="text-xl max-md:text-base max-sm:text-xs font-semibold">
                  +250
               </p>
               <IoTimerOutline className="text-[25px] max-sm:text-[18px]" />
            </div>

            <div className="relative flex items-center justify-center w-96 h-96 max-md:w-80 max-md:h-80 max-sm:w-52 max-sm:h-40">
               <svg
                  className="absolute w-80 h-80 max-md:w-60 max-md:h-60 max-sm:w-52 max-sm:h-52 max-[475px]:w-40 max-[475px]:h-40"
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
                     strokeDashoffset="70"
                     transform="rotate(-90 50 50)"
                  />
               </svg>
               <div className="absolute text-center">
                  <div className="text-5xl max-md:text-4xl max-sm:text-2xl font-bold">
                     01:00:00
                  </div>
                  <p className="mt-3 max-sm:mt-0 text-3xl max-md:text-2xl max-sm:text-lg font-bold text-green-400">
                     +0 баллов
                  </p>
               </div>
            </div>

            <div className="flex items-center gap-2 max-sm:gap-0.5 rounded-full px-3 py-1.5 max-sm:px-2 bg-green-400">
               <p className="text-xl max-md:text-base max-sm:text-xs font-semibold">
                  14/10
               </p>
               <IoSettingsOutline className="text-[25px] max-sm:text-[18px]" />
            </div>
         </div>

         <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
            <Button className="text-2xl max-sm:text-xl px-10 py-10 max-sm:py-7 max-sm:px-6 rounded-t-3xl rounded-b-[100px] border border-white text-white bg-blue-600">
               Сжигание Жира
            </Button>
         </div>
      </div>
   );
};

export default Timer;
