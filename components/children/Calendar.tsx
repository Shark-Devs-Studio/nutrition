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

const courses = [
   1, 2, 3, 4, 11, 12, 13, 14, 15, 16, 17, 18, 24, 25, 26, 27, 28, 29, 30, 31,
]; // Дни с курсами
const trainings = [12, 14, 16, 18]; // Дни с тренировками
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
   const start = startOfMonth(selectedDate);
   const end = endOfMonth(selectedDate);
   const days = eachDayOfInterval({ start, end });
   const startDay = getDay(start) === 0 ? 6 : getDay(start) - 1;

   const today = new Date();

   const calendarDays = days.map((day) => {
      const dayOfMonth = day.getDate();
      return {
         day: dayOfMonth,
         isTraining: trainings.includes(dayOfMonth),
         isCourse: courses.includes(dayOfMonth),
         isDisabled: !courses.includes(dayOfMonth),
         isToday:
            dayOfMonth === today.getDate() &&
            selectedDate.getMonth() === today.getMonth() &&
            selectedDate.getFullYear() === today.getFullYear(),
      };
   });

   const handleDayClick = (day: Date) => {
      setSelectedDate(day); 
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
                     className="text-sm py-7 px-6"
                  >
                     <MdKeyboardDoubleArrowRight className="rotate-180" />
                  </Button>
                  <Button
                     onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
                     className="text-sm py-7 px-6"
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
                     className="text-sm py-7 px-6 bg-white"
                  >
                     <MdKeyboardArrowRight className="" />
                  </Button>
                  <Button
                     onClick={() => setSelectedDate(addYears(selectedDate, 1))}
                     className="text-sm py-7 px-6"
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
                        className={`${dayObj.isCourse ? "bg-white" : ""}`}
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
