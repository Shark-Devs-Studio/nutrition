"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { IoMdMenu } from "react-icons/io";
import Calendar from "./children/Calendar";
import { format } from "date-fns";
import { dateAtom } from "@/lib/state";
import { useAtom } from "jotai";
import dayjs from "dayjs";

const Header = () => {
   const [showCalendar, setShowCalendar] = useState(false);
   const [selectedDate, setSelectedDate] = useState(new Date());
   const [date] = useAtom(dateAtom);

   useEffect(() => {
      if (showCalendar) {
         document.body.classList.add("overflow-hidden");
      } else {
         document.body.classList.remove("overflow-hidden");
      }

      return () => document.body.classList.remove("overflow-hidden");
   }, [showCalendar]);

   return (
      <header className="mb-10 max-xl:mb-5 py-5 max-xl:py-4 shadow-md">
         <div className="custom-container relative mx-auto flex items-center justify-between px-4">
            <button className="w-fit h-fit rounded-xl p-4 max-xl:py-3 max-xl:p-3 max-sm:p-2 bg-[#f7f7f9]">
               <img className="w-10 max-sm:w-8" src="/icons/menu.svg" alt="" />
            </button>

            <div className="text-center">
               <p className="flex items-center justify-start gap-2">
                  <span className="text-4xl max-md:text-3xl mb-2.5 max-sm:mb-1 gilroy-bold">
                     7
                  </span>
                  <img
                     className="h-4 max-sm:h-3.5"
                     src="/icons/vector.svg"
                     alt=""
                  />
                  <span className="text-2xl max-md:text-base gilroy-medium">
                     1231200 баллов
                  </span>
               </p>
            </div>

            <Button
               onClick={() => setShowCalendar(!showCalendar)}
               className="relative flex flex-col items-center gap-0 px-8 py-9 max-xl:py-7 max-xl:px-5 max-md:py-6 max-md:px-3 rounded-xl bg-blue text-white"
            >
               <span className="absolute -top-2 max-sm:-top-1 left-[15%] w-1.5 max-sm:w-1 h-3 bg-blue" />
               <span className="absolute -top-2 max-sm:-top-1 left-[50%] -translate-x-1/2 w-1.5 max-sm:w-1 h-3 bg-blue" />
               <span className="absolute -top-2 max-sm:-top-1 left-[80%] w-1.5 max-sm:w-1 h-3 bg-blue" />
               <p className="text-lg max-xl:text-base max-md:text-xs gilroy-medium absolute top-0 right-4 max-xl:-top-1 max-xl:right-1 max-md:top-0.5">
                  день
               </p>
               <p className="flex items-center">
                  <span className="text-3xl max-xl:text-2xl gilroy-bold leading-3 mr-1">
                     {dayjs(date).format("DD")}
                  </span>
                  |
                  <span className="text-2xl max-xl:text-xl max-md:text-base gilroy-bold ml-1">
                     {dayjs(date).format("MM")}
                  </span>
               </p>
            </Button>
            {showCalendar && (
               <Calendar
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  onClose={() => setShowCalendar(false)}
               />
            )}
         </div>
      </header>
   );
};

export default Header;
