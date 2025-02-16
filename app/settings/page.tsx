import React from "react";
import axios from "axios";
import IntervalSettings from "@/components/IntervalSettings";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

const page = async () => {
   const res = await axios.get(
      `${process.env.NEXT_PUBLIC_MOCK_API_SECRET}/settings`
   );
   const settings = res.data;

   return (
      <main>
         <div className="custom-container mt-10 max-md:mt-5">
            <div className="max-w-5xl mx-auto mb-10 max-md:mb-6 flex items-center justify-between">
               <Link href={"/"} className="bg-[#f7f7f9] py-4 px-5 rounded-xl">
                  <FaArrowLeft
                     className="text-[20px] max-md:text-[18px]"
                     color="#000"
                  />
               </Link>

               <p className="text-2xl gilroy-regular">Настройки</p>

               <div className=""></div>
            </div>

            <div className="max-w-5xl mx-auto">
               <div className="flex items-center justify-between mb-10 max-sm:mb-6">
                  <div className="flex gap-5">
                     <Image
                        src={"/icons/carrot.svg"}
                        width={30}
                        height={30}
                        alt="carrot"
                     />
                     <div className="">
                        <p className="uppercase text-3xl max-lg:text-2xl max-md:text-xl max-sm:text-base gilroy-bold">
                           Интервал и время голодание
                        </p>
                        <p className="text-xl max-lg:text-base max-md:text-xs max-sm:text-[10px] font-gilroy-regular">
                           начните голодание +- 15 минут от выбраного времени
                        </p>
                     </div>
                  </div>

                  <div className="">
                     <button className="bg-blue text-white py-4 px-4 max-sm:px-3 max-sm:py-3 rounded-xl">
                        <img
                           src="/icons/info.svg"
                           className="w-7 max-lg:w-5 max-lg:h-5"
                           alt=""
                        />
                     </button>
                  </div>
               </div>
               <IntervalSettings settings={settings} />
            </div>
         </div>
      </main>
   );
};

export default page;
