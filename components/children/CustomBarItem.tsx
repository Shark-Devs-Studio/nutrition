import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

interface CustomBarProps {
   x: number;
   y: number;
   height: number;
   start: string;
   end?: string; // Убедитесь, что end теперь опциональный
   supperEnd: string; // Добавлен supperEnd
   progress: number;
}

const CustomBar: React.FC<CustomBarProps> = ({
   x,
   y,
   height,
   start,
   end,
   supperEnd,
   progress,
}) => {
   const [offsetX, setOffsetX] = useState(40); // Значение по умолчанию
   const [currentProgress, setCurrentProgress] = useState(progress); // Состояние для прогресса

   // Функция для вычисления прогресса
   const calculateProgress = () => {
      const currentTime = dayjs();
      const startTime = dayjs(start, "HH:mm");
      const endTime = end ? dayjs(end, "HH:mm") : dayjs(supperEnd, "HH:mm");

      // Вычисление разницы в минутах между start и end/supperEnd
      const totalDuration = endTime.diff(startTime, "minute");
      const elapsedTime = currentTime.diff(startTime, "minute");

      if (totalDuration <= 0) return 100; // Прогресс завершен, если время прошло

      return Math.min((elapsedTime / totalDuration) * 100, 100); // Прогресс по времени
   };

   useEffect(() => {
      const updateOffsetX = () => {
         const width = window.innerWidth;
         if (width >= 1024) setOffsetX(40);
         else if (width >= 768) setOffsetX(25);
         else if (width >= 640) setOffsetX(17);
         else setOffsetX(1); // Для совсем маленьких экранов
      };

      updateOffsetX();
      window.addEventListener("resize", updateOffsetX);
      return () => window.removeEventListener("resize", updateOffsetX);
   }, []);

   useEffect(() => {
      const interval = setInterval(() => {
         setCurrentProgress(calculateProgress()); // Обновление прогресса каждую минуту
      }, 1000); // 60000 миллисекунд = 1 минута

      return () => clearInterval(interval); // Очистка интервала при размонтировании компонента
   }, [start, end, supperEnd]);

   const calculatedProgress = progress === 100 ? 100 : calculateProgress();

   return (
      <div
         className="w-28 max-lg:w-20 max-md:w-16 max-sm:w-8"
         style={{
            position: "absolute",
            left: `${x - offsetX}px`, // 40, 1024px=30, 768px=17, 640px=3
            top: `${y}px`,
            height: `${height}px`,
            transition: "0.3s",
            borderRadius: "100px",
         }}
      >
         <div className="h-full relative">
            <p className="pointer-events-none select-none text-sm max-sm:text-[10px] gilroy-bold absolute -top-5 left-1/2 -translate-x-1/2 text-[#4467e3]">
               {calculatedProgress === 100 ? end : ""}
            </p>
            <div className="w-full h-full flex rounded-full overflow-hidden">
               <div
                  className="w-full mt-auto"
                  style={{
                     height: `${calculatedProgress}%`,
                     backgroundColor:
                        calculatedProgress === 100 ? "#4467e3" : "#63db85",
                  }}
               />
            </div>
            <p className="pointer-events-none select-none text-sm max-sm:text-[10px] gilroy-bold absolute -bottom-5 left-1/2 -translate-x-1/2 text-[#4467e3]">
               {start}
            </p>
         </div>
      </div>
   );
};

export default CustomBar;
