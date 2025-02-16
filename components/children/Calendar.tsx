"use client";
import {
   format,
   startOfMonth,
   endOfMonth,
   eachDayOfInterval,
   getDay,
   subMonths,
   addMonths,
   subYears,
   addYears,
} from "date-fns";

import { FaDumbbell } from "react-icons/fa";
import { Button } from "../ui/button";
import {
   MdKeyboardArrowRight,
   MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { useAtom } from "jotai";
import { dateAtom } from "@/lib/state";
import dayjs from "dayjs";

const courses = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const trainings = [3, 6, 8, 11, 13];
const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

interface CalendarProps {
   selectedDate: Date;
   setSelectedDate: (date: Date) => void;
   onClose: () => void;
}

const Calendar = ({
   selectedDate,
   setSelectedDate,
   onClose,
}: CalendarProps) => {
   const [date, setDate] = useAtom(dateAtom);
   const start = startOfMonth(selectedDate);
   const end = endOfMonth(selectedDate);
   const days = eachDayOfInterval({ start, end });
   const startDay = getDay(start) === 0 ? 6 : getDay(start) - 1;

   const calendarDays = days.map((day) => {
      const dayOfMonth = day.getDate();

      return {
         day: dayOfMonth,
         isTraining: trainings.includes(dayOfMonth),
         isCourse: courses.includes(dayOfMonth),
         isDisabled: !courses.includes(dayOfMonth),
         isToday:
            dayOfMonth === date.date() &&
            selectedDate.getMonth() === date.month() &&
            selectedDate.getFullYear() === date.year(),
      };
   });

   const handleDayClick = (day: Date) => {
      setSelectedDate(day);
      setDate(dayjs(day));
      onClose();
   };

   return (
      <div
         className="fixed z-10 inset-0 flex justify-center items-start pt-28 max-xl:pt-[88px] max-md:pt-20"
         onClick={onClose}
      >
         <div
            className="relative w-[500px] bg-[#f0f0f0] calendar-container"
            onClick={(e) => e.stopPropagation()}
         >
            <div className="flex justify-between items-center">
               <div className="">
                  <Button
                     onClick={() => setSelectedDate(subYears(selectedDate, 1))}
                     className="text-sm py-7 px-6 duration-200 hover:bg-white"
                  >
                     <MdKeyboardDoubleArrowRight className="rotate-180" />
                  </Button>
                  <Button
                     onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
                     className="text-sm py-7 px-6 duration-200 hover:bg-white"
                  >
                     <MdKeyboardArrowRight className="rotate-180" />
                  </Button>
               </div>
               <h3 className="text-lg text-[#c4c4c4]">
                  {format(selectedDate, "MMMM yyyy")}
               </h3>
               <div className="">
                  <Button
                     onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
                     className="text-sm py-7 px-6 duration-200 hover:bg-white"
                  >
                     <MdKeyboardArrowRight className="" />
                  </Button>
                  <Button
                     onClick={() => setSelectedDate(addYears(selectedDate, 1))}
                     className="text-sm py-7 px-6 duration-200 hover:bg-white"
                  >
                     <MdKeyboardDoubleArrowRight className="" />
                  </Button>
               </div>
            </div>
            <div className="grid grid-cols-7 gap-2 pt-3 text-center font-bold bg-white">
               {weekDays.map((day, index) => (
                  <div key={index} className="p-2 uppercase">
                     {day}
                  </div>
               ))}
            </div>
            <div className="grid grid-cols-7 text-center">
               {[...Array(startDay)].map((_, i) => (
                  <div key={i} />
               ))}
               {calendarDays.map((dayObj, idx) => {
                  const dayOfWeek = getDay(
                     new Date(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth(),
                        dayObj.day
                     )
                  );
                  const isWeekend = dayOfWeek === 6 || dayOfWeek === 0;
                  return (
                     <div
                        key={idx}
                        className={`gilroy-medium ${
                           dayObj.isCourse ? "bg-white" : ""
                        }`}
                     >
                        <div
                           className={`relative px-2 py-2.5 rounded-lg cursor-pointer ${
                              isWeekend ? "text-red-500" : ""
                           } ${
                              dayObj.isCourse ? "bg-[#f2f8fd] rounded-xl" : ""
                           } ${
                              dayObj.isDisabled
                                 ? "opacity-50 cursor-not-allowed"
                                 : ""
                           }
                           ${dayObj.isTraining ? "rounded-none" : ""}
                           ${
                              dayObj.isToday
                                 ? "bg-blue/95 text-white border-green border-b-4"
                                 : ""
                           }`}
                           onClick={() =>
                              !dayObj.isDisabled &&
                              handleDayClick(
                                 new Date(
                                    selectedDate.getFullYear(),
                                    selectedDate.getMonth(),
                                    dayObj.day
                                 )
                              )
                           }
                        >
                           <div className="">
                              <p className="text-lg font-medium">
                                 {dayObj.day}
                              </p>
                              {dayObj.isTraining && (
                                 <FaDumbbell className="absolute bottom-1 right-1 -rotate-45 text-black" />
                              )}
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>
      </div>
   );
};

export default Calendar;
