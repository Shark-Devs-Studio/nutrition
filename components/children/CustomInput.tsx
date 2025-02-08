"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAtom, WritableAtom } from "jotai";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { TextField } from "@mui/material";
import dayjs from "dayjs";

interface Props {
   title: string;
   time: dayjs.Dayjs | null;
   range: string[];
   disabled: boolean;
   getTime: (time: any) => void;
   status: boolean;
   circadianRhythm: string;
   setPoints?: (points: any) => void;
   points: number;
}

const CustomInput: React.FC<Props> = ({
   title,
   range,
   time,
   disabled,
   getTime,
   status,
   circadianRhythm,
   setPoints,
   points,
}) => {
   const hasAwardedPoints = useRef(false); // Флаг, начислялись ли уже баллы

   useEffect(() => {
      if (time && setPoints && !hasAwardedPoints.current) {
         setPoints((prev: number) => prev + 100);
         hasAwardedPoints.current = true; // Устанавливаем флаг, чтобы больше не начислять баллы
      }
   }, [time, setPoints]);

   return (
      <>
         <div className="w-40 relative">
            <p className="text-xl gilroy-medium">
               {title} | {time ? dayjs(time).format("DD:MM") : ""}
            </p>
            <div className="relative gilroy-medium">
               <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["TimePicker"]}>
                     <TimePicker
                        onChange={(e) => getTime(dayjs(e))}
                        disabled={disabled}
                        ampm={false}
                        value={time || null}
                        viewRenderers={{
                           hours: renderTimeViewClock,
                           minutes: renderTimeViewClock,
                           seconds: renderTimeViewClock,
                        }}
                        slotProps={{
                           textField: {
                              helperText: time ? "+100" : "",
                           } as Partial<React.ComponentProps<typeof TextField>>,
                        }}
                        sx={{
                           "& .MuiFormHelperText-root": {
                              position: "absolute",
                              top: "-11px",
                              left: "50%",
                              transform: "translateX(-70%)",
                              color: status ? "red" : "#fff",
                              fontFamily: "gilroy-medium",
                              fontSize: "12px",
                              fontWeight: "medium",
                              backgroundColor: "#63db85",
                              padding: "0px 8px",
                              borderRadius: "20px",
                           },
                           "& .css-1umw9bq-MuiSvgIcon-root": {
                              color: status
                                 ? "red"
                                 : time
                                 ? "#63db85"
                                 : "#4467e3" + " !important",
                           },
                           "& ::placeholder": {
                              color: status ? "red" : "#4467e3",
                           },
                           "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              fontSize: "20px",
                              color: time ? "#63db85" : "#4467e3",
                              "& fieldset": {
                                 borderColor: status
                                    ? "red"
                                    : time
                                    ? "#63db85"
                                    : "#4467e3",
                              },
                              "&:hover fieldset": {
                                 borderColor: status ? "red" : "#4467e3",
                              },
                              "&.Mui-focused fieldset": {
                                 borderColor: status ? "red" : "#63db85",
                              },
                              "&.Mui-focused": {
                                 color: status ? "red" : "#63db85",
                              },
                           },
                        }}
                     />
                  </DemoContainer>
               </LocalizationProvider>
            </div>
            <p className="text-lg max-sm:text-sm mt-1 gilroy-regular">
               👍 Пн,
               <span className="text-black gilroy-medium">17:45 - 18:15</span>
            </p>
         </div>
      </>
   );
};

export default CustomInput;
