import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";

interface CustomBarProps {
   x: number;
   y: number;
   height: number;
   start: string;
   end?: string;
   supperEnd: string;
   progress: number;
   label: string;
}

const CustomBar: React.FC<CustomBarProps> = ({
   x,
   y,
   height,
   start,
   end,
   supperEnd,
   progress,
   label,
}) => {
   const [offsetX, setOffsetX] = useState(40);
   const [currentProgress, setCurrentProgress] = useState(progress);

   const calculateProgress = () => {
      const currentTime = dayjs();
      const startTime = dayjs(start, "HH:mm");
      const endTime = end ? dayjs(end, "HH:mm") : dayjs(supperEnd, "HH:mm");

      const totalDuration = endTime.diff(startTime, "minute");
      const elapsedTime = currentTime.diff(startTime, "minute");

      if (totalDuration <= 0) return 100;

      return Math.min((elapsedTime / totalDuration) * 100, 100);
   };

   const updateOffsetX = useCallback(() => {
      const width = window.innerWidth;
      setOffsetX(
         width >= 1024 ? 40 : width >= 768 ? 25 : width >= 640 ? 17 : 1
      );
   }, []);

   useEffect(() => {
      updateOffsetX();
      window.addEventListener("resize", updateOffsetX);
      return () => window.removeEventListener("resize", updateOffsetX);
   }, [updateOffsetX]);

   useEffect(() => {
      const interval = setInterval(() => {
         setCurrentProgress(calculateProgress());
      }, 1000);

      return () => clearInterval(interval);
   }, []);

   const calculatedProgress = progress === 100 ? 100 : calculateProgress();

   return (
      <div
         className="w-28 max-lg:w-20 max-md:w-16 max-sm:w-8 group"
         style={{
            position: "absolute",
            left: `${x - offsetX}px`,
            top: `${y}px`,
            height: `${height}px`,
            transition: "0.3s",
            borderRadius: "100px",
         }}
      >
         {calculatedProgress === 100 && (
            <div className="w-20 max-lg:w-16 absolute -top-5 -right-12 max-lg:-right-10 max-sm:-right-4 z-10 group-hover:opacity-100 opacity-0 gap-3 px-2 py-1 max-lg:py-0.5 max-md:px-1 duration-300 rounded-[4px] pointer-events-none select-none bg-black/80 text-white">
               <p className="text-xs max-lg:text-[10px] gilroy-bold lg:mb-1">
                  {label}
               </p>
               <div className="flex flex-col gilroy-regular">
                  <p className="text-xs max-lg:text-[10px] max-md:leading-3">
                     C {start}
                  </p>
                  <p className="text-xs max-lg:text-[10px] max-md:leading-3">
                     до {end}
                  </p>
               </div>
            </div>
         )}
         <div className="h-full relative">
            <p className="pointer-events-none select-none text-sm max-sm:text-[10px] gilroy-bold absolute -top-5 left-1/2 -translate-x-1/2 text-[#4467e3]">
               {calculatedProgress === 100 ? end : ""}
            </p>
            <div className="w-full h-full flex rounded-full overflow-hidden">
               <div
                  className={`w-full mt-auto hover:cursor-pointer`}
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
