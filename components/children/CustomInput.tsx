"use client";
import React, { useEffect, useRef, useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { TextField } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/ru";

dayjs.locale("ru");

interface Props {
   title: string;
   time: dayjs.Dayjs | null;
   timeUser: string;
   disabled: boolean;
   getTime: (time: any) => void;
   status: boolean;
   setPoints?: (points: any) => void;
   points: number;
   placeholder: dayjs.Dayjs | null;
   window: number;
   week: any;
}

const CustomInput: React.FC<Props> = ({
   title,
   timeUser,
   time,
   disabled,
   getTime,
   status,
   setPoints,
   points,
   placeholder,
   window,
   week,
}) => {
   const hasAwardedPoints = useRef(false);
   const userTime = dayjs(timeUser, "HH:mm");
   const [formattedTime, setFormattedTime] = useState<string | null>(null);

   useEffect(() => {
      if (time && setPoints && !hasAwardedPoints.current) {
         const userTime = dayjs(`2025-01-21T${timeUser}`);

         const selectedMinutes = time.hour() * 60 + time.minute();
         const userMinutes = userTime.hour() * 60 + userTime.minute();

         if (
            selectedMinutes >= userMinutes - window / 2 &&
            selectedMinutes <= userMinutes + window / 2
         ) {
            setPoints((prev: number) => prev + 100);
            hasAwardedPoints.current = true;
         }
      }
   }, [time, setPoints, timeUser, window]);

   useEffect(() => {
      const startTime = userTime.subtract(window / 2, "minute").format("HH:mm");
      const endTime = userTime.add(window / 2, "minute").format("HH:mm");

      setFormattedTime(`${startTime}-${endTime}`);
   }, [userTime, window]);

   return (
      <>
         <div className="w-40 relative">
            <p className="text-xl gilroy-medium">
               {title} |{" "}
               {time ? dayjs(time).format("DD.MM") : dayjs().format("DD.MM")}
            </p>
            <div className="relative gilroy-medium">
               <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["TimePicker"]}>
                     <TimePicker
                        onChange={(e) => getTime(dayjs(e))}
                        disabled={disabled}
                        ampm={false}
                        value={time ? time : placeholder}
                        viewRenderers={{
                           hours: renderTimeViewClock,
                           minutes: renderTimeViewClock,
                           seconds: renderTimeViewClock,
                        }}
                        slotProps={{
                           textField: {
                              helperText: hasAwardedPoints.current
                                 ? "+100"
                                 : "",
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
                              color: status
                                 ? "red"
                                 : time
                                 ? "#63db85"
                                 : "#4467e3",
                              "& fieldset": {
                                 borderColor: status
                                    ? "red"
                                    : time
                                    ? "#63db85"
                                    : "#4467e3",
                              },
                              "&:hover fieldset": {
                                 borderColor: status
                                    ? "red"
                                    : disabled
                                    ? "none"
                                    : "#63db85",
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
               👍 <span className="capitalize">{week}</span>,
               <span className="text-black gilroy-medium ml-1">
                  {formattedTime}
               </span>
            </p>
         </div>
      </>
   );
};

export default CustomInput;
