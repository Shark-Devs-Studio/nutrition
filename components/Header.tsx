import { Button } from "@/components/ui/button";
import { IoMdMenu } from "react-icons/io";

const Header = () => {
   return (
      <header className="mb-10 max-xl:mb-5 py-5 max-xl:py-4 shadow-md">
         <div className="container mx-auto flex items-center justify-between px-4">
            <Button
               // variant="outline"
               className="rounded-xl px-6 py-8 max-xl:py-7 max-xl:px-4 max-md:p-3"
            >
               <IoMdMenu className="text-[50px] max-xl:text-[30px] max-md:text-[20px]" />
            </Button>

            <div className="text-center">
               <p>
                  <span className="text-4xl max-md:text-3xl font-bold">7 </span>
                  <span className="text-2xl max-md:text-base">
                     | 1231200 баллов
                  </span>
               </p>
            </div>

            <Button className="relative flex flex-col items-center gap-0 px-8 py-9 max-xl:py-7 max-xl:px-5 max-md:py-6 max-md:px-3 rounded-xl bg-blue-600 text-white">
               <span className="absolute -top-2 max-sm:-top-1 left-[15%] w-1.5 max-sm:w-1 h-3 bg-blue-600" />
               <span className="absolute -top-2 max-sm:-top-1 left-[50%] -translate-x-1/2 w-1.5 max-sm:w-1 h-3 bg-blue-600" />
               <span className="absolute -top-2 max-sm:-top-1 left-[80%] w-1.5 max-sm:w-1 h-3 bg-blue-600" />
               <p className="text-lg max-xl:text-base max-md:text-xs absolute top-0 right-4 max-xl:-top-1 max-xl:right-1 max-md:top-0.5">
                  день
               </p>
               <p>
                  <span className="text-3xl max-xl:text-2xl leading-3">6 </span>
                  |
                  <span className="text-2xl max-xl:text-xl max-md:text-base ml-1">
                     15
                  </span>
               </p>
            </Button>
         </div>
      </header>
   );
};

export default Header;
