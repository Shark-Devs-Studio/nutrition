"use client";
import React, { useState, useEffect } from "react";
import { useAtom, WritableAtom } from "jotai";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { RiResetRightFill } from "react-icons/ri";
import dayjs from "dayjs";
import { TextField } from "@mui/material";

interface Props {
   atom: WritableAtom<string, [string], void>;
   onTimeChange: (newTime: string) => void;
}

const CustomInput: React.FC<Props> = ({ atom, onTimeChange }) => {
   const [value, setValue] = useAtom(atom);
   const [isManualChange, setIsManualChange] = useState(false);
   const [selectedTime, setSelectedTime] = useState<dayjs.Dayjs | null>(null);
   const [isFocused, setIsFocused] = useState(false); // Контроль фокуса

   const handleTimeChange = (newTime: dayjs.Dayjs | null) => {
      setSelectedTime(newTime);
      setIsManualChange(true);
      if (newTime) {
         const formattedTime = newTime.format("HH:mm");
         setValue(formattedTime);
         onTimeChange(formattedTime);
      }
   };

   useEffect(() => {
      if (value) {
         setSelectedTime(dayjs(value, "HH:mm"));
      }
   }, [value]);

   return (
      <div className="relative gilroy-medium">
         <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["TimePicker"]}>
               <TimePicker
                  value={selectedTime}
                  onChange={handleTimeChange}
                  ampm={false}
                  viewRenderers={{
                     hours: renderTimeViewClock,
                     minutes: renderTimeViewClock,
                     seconds: renderTimeViewClock,
                  }}
                  slotProps={{
                     textField: {
                        onFocus: () => setIsFocused(true),
                        onBlur: () => setIsFocused(false),
                        helperText: isFocused ? "+100" : "",
                     } as Partial<React.ComponentProps<typeof TextField>>,
                  }}
                  sx={{
                     "& .MuiFormHelperText-root": {
                        position: "absolute",
                        top: "-11px",
                        left: "50%",
                        transform: "translateX(-70%)",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: "medium",
                        backgroundColor: "#63db85",
                        padding: "0px 8px",
                        borderRadius: "20px",
                     },
                     "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        fontSize: "20px",
                        color: "#4467e3",
                        "& fieldset": { borderColor: "#4467e3" },
                        "&:hover fieldset": { borderColor: "#4467e3" },
                        "&.Mui-focused fieldset": { borderColor: "#63db85" },
                        "&.Mui-focused": { color: "#63db85" },
                     },
                  }}
               />
            </DemoContainer>
         </LocalizationProvider>

         {isManualChange && (
            <button className="absolute -right-7 top-1/2 transform -translate-y-6 cursor-pointer">
               <RiResetRightFill size={25} color="#4467e3" />
            </button>
         )}

      </div>
   );
};

export default CustomInput;
