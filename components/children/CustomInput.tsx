"use client";
import React, { useState, useEffect } from "react";
import { useAtom, WritableAtom } from "jotai";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { TextField } from "@mui/material";
import dayjs from "dayjs";

interface Props {
   value: any;
   time: any;
   range: string[];
   disabled: boolean;
   getTime: (time: any) => void;
   status: boolean;
}

const CustomInput: React.FC<Props> = ({
   value,
   range,
   time,
   disabled,
   getTime,
   status,
}) => {
   const [isFocused, setIsFocused] = useState(false); // Контроль фокуса

   return (
      <div className="relative gilroy-medium">
         <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["TimePicker"]}>
               <TimePicker
                  onChange={(e) => getTime(dayjs(e))}
                  disabled={disabled}
                  ampm={false}
                  value={time ? value : null}
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
                        color: status ? "red" : "#4467e3",
                        fontSize: "12px",
                        fontWeight: "medium",
                        backgroundColor: "#63db85",
                        padding: "0px 8px",
                        borderRadius: "20px",
                     },
                     "& .css-1umw9bq-MuiSvgIcon-root": {
                        color: status ? "red" : "#4467e3" + " !important",
                     },
                     "& ::placeholder": {
                        color: status ? "red" : "#4467e3",
                     },
                     "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        fontSize: "20px",
                        color: "#4467e3",
                        "& fieldset": {
                           borderColor: status ? "red" : "#4467e3",
                        },
                        "&:hover fieldset": {
                           borderColor: status ? "red" : "#4467e3",
                        },
                        "&.Mui-focused fieldset": {
                           borderColor: status ? "red" : "#63db85",
                        },
                        "&.Mui-focused": { color: status ? "red" : "#63db85" },
                     },
                  }}
               />
            </DemoContainer>
         </LocalizationProvider>
      </div>
   );
};

export default CustomInput;
