import { Button } from "@/components/ui/button";
import { FaCarrot } from "react-icons/fa";

import Header from "@/components/Header";
import Timer from "@/components/Timer";
import TimerSettings from "@/components/TimerSettings";
import FastingChart from "@/components/FastingChart";

export default function Home() {
   return (
      <>
         <Header />

         <main className="custom-container mb-10">
            <div className="rounded-xl overflow-hidden pb-5 shadow-[0px_5px_15px_#999]">
               <div className="flex justify-between items-center px-4 py-5 max-sm:py-3">
                  <div className="flex items-center gap-3">
                     <img src="/icons/carrot.svg" alt="carrot" />
                     <div>
                        <p className="text-4xl max-xl:text-2xl max-md:text-lg gilroy-bold">
                           ПИТАТЬСЯ ПО ВРЕМЕНИ
                        </p>
                        <p className="text-2xl max-xl:text-xl max-md:text-base gilroy-regular uppercase">
                           До <span className="gilroy-medium">700</span> баллов
                        </p>
                     </div>
                  </div>

                  <Button className="bg-blue text-white py-8 px-7 max-xl:py-6 max-xl:px-4 max-sm:px-3 max-sm:py-2 rounded-xl">
                     <img src="/icons/info.svg" className="w-7 max-lg:w-5 max-lg:h-5" alt="" />
                  </Button>
               </div>

               <Timer />

               <TimerSettings />

               <FastingChart />
            </div>
         </main>
      </>
   );
}
