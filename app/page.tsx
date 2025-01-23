"use client";

import { Button } from "@/components/ui/button";
import { FaCarrot } from "react-icons/fa";
import { InputMask } from "@react-input/mask";

import Chart from "@/components/Chart";
import Header from "@/components/Header";
import Timer from "@/components/Timer";

export default function Home() {
   return (
      <>
         <Header />

         <main className="custom-container mb-10">
            <div className="rounded-xl overflow-hidden pb-5 shadow-[0px_5px_15px_#999]">
               <div className="flex justify-between items-center px-4 py-5 max-sm:py-3">
                  <div className="flex items-center gap-3">
                     <FaCarrot className="text-[40px] max-xl:text-[25px]" />
                     <div>
                        <p className="text-4xl max-xl:text-2xl max-md:text-base font-bold">
                           ПИТАТЬСЯ ПО ВРЕМЕНИ
                        </p>
                        <p className="text-2xl max-xl:text-xl max-md:text-base">
                           До <span className="font-medium">700</span> баллов
                        </p>
                     </div>
                  </div>

                  <Button className="bg-blue-600 text-white py-8 px-7 max-xl:py-6 max-xl:px-5 max-sm:px-4 max-sm:py-2 rounded-xl">
                     <span className="text-5xl max-xl:text-3xl max-sm:text-xl">
                        i
                     </span>
                  </Button>
               </div>

               <Timer />

               <div className="flex items-center justify-center max-md:justify-around md:gap-14 px-4 py-5 mt-16">
                  <div className="max-md:w-32">
                     <p className="text-xl max-md:text-base font-medium mb-2 max-sm:mb-1.5">
                        Начало | 26.08
                     </p>

                     <InputMask
                        className="w-32 rounded-xl py-3 px-3 text-xl max-sm:text-lg border-2 text-blue-300 border-blue-200 outline-green-300 focus:text-green-400 placeholder-blue-200 focus:placeholder-green-400"
                        mask="__:__"
                        placeholder="ЧЧ:ММ"
                        replacement={{ _: /\d/ }}
                        type="tel"
                     />

                     <p className="text-gray-500 text-lg max-sm:text-sm mt-1">
                        Пн, <span className="text-black">17:45 - 18:15</span>
                     </p>
                  </div>

                  <div className="max-md:w-32">
                     <p className="text-xl max-md:text-base font-medium mb-2 max-sm:mb-1.5">
                        Конец | 26.08
                     </p>

                     <InputMask
                        className="w-32 rounded-xl py-3 px-3 text-xl max-sm:text-lg border-2 text-blue-300 border-blue-200 outline-green-300 focus:text-green-400 placeholder-blue-200 focus:placeholder-green-400"
                        mask="__:__"
                        placeholder="ЧЧ:ММ"
                        replacement={{ _: /\d/ }}
                        type="tel"
                     />

                     <p className="text-gray-500 text-lg max-sm:text-sm mt-1">
                        Пн, <span className="text-black">17:45 - 18:15</span>
                     </p>
                  </div>
               </div>

               <div className="max-w-7xl w-full mx-auto px-4 py-5">
                  <div className="flex items-center justify-between py-5 px-10 max-sm:p-4 rounded-xl text-white bg-blue-600">
                     <p className="text-3xl max-md:text-2xl max-sm:text-base font-semibold uppercase">
                        Завершить ГОЛОДАНИЕ
                     </p>
                     <p className="text-3xl max-sm:text-lg font-medium text-green-400">
                        +0 баллов
                     </p>
                  </div>

                  <div className="mt-5">
                     <Chart />
                  </div>
               </div>
            </div>
         </main>
      </>
   );
}
