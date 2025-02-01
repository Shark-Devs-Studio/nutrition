"use client";
import React, { useState, useEffect } from "react";
import { useAtom, WritableAtom } from "jotai";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { RiResetRightFill } from "react-icons/ri";
import dayjs from "dayjs"; // Использование dayjs без utc

interface Props {
   atom: WritableAtom<string, [string], void>;
   onTimeChange: (newTime: string) => void; // Функция для обработки изменения времени
}

const CustomInput: React.FC<Props> = ({ atom, onTimeChange }) => {
   const [value, setValue] = useAtom(atom); // atom, который будет хранить время
   const [isManualChange, setIsManualChange] = useState(false);
   const [selectedTime, setSelectedTime] = useState<dayjs.Dayjs | null>(null); // Для хранения выбранного времени

   // Функция для обработки изменения времени в TimePicker
   const handleTimeChange = (newTime: dayjs.Dayjs | null) => {
      setSelectedTime(newTime);
      setIsManualChange(true); // Иконка появляется, когда вводим вручную
      if (newTime) {
         const formattedTime = newTime.format("HH:mm");
         setValue(formattedTime); // Обновляем atom с выбранным временем в формате строки
         onTimeChange(formattedTime); // Передаем новое время в родительский компонент
      }
   };

   // Инициализация selectedTime значением из atom
   useEffect(() => {
      if (value) {
         setSelectedTime(dayjs(value, "HH:mm")); // Преобразуем строку из atom в dayjs объект
      }
   }, [value]);

   return (
      <div className="relative">
         <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["TimePicker"]}>
               <TimePicker
                  value={selectedTime} // Отображаемое значение из selectedTime
                  onChange={handleTimeChange} // Обрабатываем выбор времени
                  ampm={false}
                  viewRenderers={{
                     hours: renderTimeViewClock,
                     minutes: renderTimeViewClock,
                     seconds: renderTimeViewClock,
                  }}
               />
            </DemoContainer>
         </LocalizationProvider>

         {isManualChange && (
            <button className="absolute -right-7 top-1/2 transform -translate-y-6 cursor-pointer">
               <RiResetRightFill size={25} color="#96a9eb" />
            </button>
         )}

         <p className="text-gray-500 text-lg max-sm:text-sm mt-1">
            Пн, <span className="text-black">17:45 - 18:15</span>
         </p>
      </div>
   );
};

export default CustomInput;
