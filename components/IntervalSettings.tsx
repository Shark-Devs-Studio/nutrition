"use client";
import React, { useEffect, useState } from "react";
import { fastingHoursAtom } from "@/lib/state";
import { useAtom } from "jotai";
import dayjs from "dayjs";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import {
   Box,
   FormControl,
   InputLabel,
   MenuItem,
   Select,
   SelectChangeEvent,
} from "@mui/material";

const IntervalSettings = ({ settings }: any) => {
   const [fastingHours, setFastingHoursAtom] = useAtom(fastingHoursAtom);
   const [interval, setInterval] = useState(fastingHours[0]?.id);
   const selectedInterval =
      settings.find((i: any) => i.id === interval) || settings[0];

   const [startTime, setStartTime] = useState<dayjs.Dayjs>(
      dayjs(`2025-01-21T${selectedInterval.startTimeUser}`)
   );
   const [endTime, setEndTime] = useState<dayjs.Dayjs>(
      dayjs(`2025-01-21T${selectedInterval.startTimeUser}`).add(
         selectedInterval.starvation,
         "hour"
      )
   );

   useEffect(() => {
      setStartTime(dayjs(`2025-01-21T${selectedInterval.startTimeUser}`));
      setEndTime(startTime.add(selectedInterval.starvation, "hour"));
   }, [interval]);

   const handleChange = (event: SelectChangeEvent) => {
      setInterval(event.target.value as string);
   };

   const onChange = async () => {
      try {
         await axios.put(
            `${process.env.NEXT_PUBLIC_MOCK_API_SECRET}/settings/${interval}`,
            {
               startTimeUser: startTime.format("HH:mm"),
               endTimeUser: endTime.format("HH:mm"),
               isActive: true,
            }
         );
         settings
            .filter((item: any) => item.id !== interval)
            .map((item: any) =>
               axios.put(
                  `${process.env.NEXT_PUBLIC_MOCK_API_SECRET}/settings/${item.id}`,
                  { isActive: false }
               )
            );
      } catch (err) {
         console.error(err);
      }
   };

   return (
      <div>
         <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
               <InputLabel className="text-blue" id="demo-simple-select-label">
                  Interval
               </InputLabel>
               <Select
                  className="text-blue"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={interval}
                  label="Interval"
                  onChange={(e) => handleChange(e)}
               >
                  {settings.map((item: any, idx: any) => (
                     <MenuItem key={idx} value={item.id} className="text-blue">
                        голодание-{item.starvation}ч/питание-
                        {24 - item.starvation}ч
                     </MenuItem>
                  ))}
               </Select>
            </FormControl>
         </Box>

         <div className="mt-7 max-md:mt-5">
            <div className="flex items-center justify-between">
               <p className="max-sm:text-sm gilroy-medium uppercase">
                  за длительность голодание:
               </p>
               <p className="max-sm:text-sm gilroy-bold uppercase text-green">
                  +250 баллов
               </p>
            </div>

            <div className="mt-5 flex flex-col gap-2">
               <div className="flex gap-3 items-center justify-between">
                  <div className="">
                     <p className="text-sm gilroy-regular uppercase">
                        начало голодание <br />
                        (c {selectedInterval.breackfastRange[0]} до
                        <span className="ml-1">
                           {selectedInterval.breackfastRange[1]}
                        </span>
                        часов)
                     </p>
                  </div>
                  <div className="w-32 max-sm:w-28">
                     <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["TimePicker"]}>
                           <TimePicker
                              sx={{
                                 "& .MuiOutlinedInput-root": {
                                    color: "#63db85",

                                    "& fieldset": {
                                       borderColor: "#63db85",
                                       borderWidth: "2px",
                                       borderRadius: "12px",
                                    },
                                    "&.Mui-focused fieldset": {
                                       borderColor: "#63db85" + "!important",
                                    },
                                    "&:hover fieldset": {
                                       borderColor: "#63db85",
                                    },
                                    "& .css-1umw9bq-MuiSvgIcon-root": {
                                       color: "#63db85",
                                    },
                                 },
                              }}
                              ampm={false}
                              value={startTime}
                              onChange={(newValue) => {
                                 if (newValue) {
                                    setStartTime(newValue);
                                    setEndTime(
                                       newValue.add(
                                          selectedInterval.starvation,
                                          "hour"
                                       )
                                    );
                                 }
                              }}
                              viewRenderers={{
                                 hours: renderTimeViewClock,
                                 minutes: renderTimeViewClock,
                                 seconds: renderTimeViewClock,
                              }}
                              minTime={dayjs(
                                 `2025-01-21T${fastingHours[0].breackfastRange[0]}`
                              )}
                              maxTime={dayjs(
                                 `2025-01-21T${fastingHours[0].breackfastRange[1]}`
                              )}
                           />
                        </DemoContainer>
                     </LocalizationProvider>
                  </div>
               </div>

               <div className="flex gap-3 items-center justify-between">
                  <div className="">
                     <p className="text-sm gilroy-regular uppercase">
                        начало голодание <br />
                        (c {selectedInterval.supperRange[0]} до
                        <span className="ml-1">
                           {selectedInterval.supperRange[1]}
                        </span>
                        часов)
                     </p>
                  </div>
                  <div className="w-32 max-sm:w-28">
                     <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["TimePicker"]}>
                           <TimePicker
                              sx={{
                                 "& .MuiOutlinedInput-root": {
                                    color: "#9ca3af",

                                    "& fieldset": {
                                       borderColor: "#63db85" + "!important",
                                       borderWidth: "2px",
                                       borderRadius: "12px",
                                    },
                                    "&.Mui-focused fieldset": {
                                       borderColor: "#63db85" + "!important",
                                    },
                                    "&:hover fieldset": {
                                       borderColor: "#63db85",
                                    },
                                    "& .css-1umw9bq-MuiSvgIcon-root": {
                                       color: "#63db85",
                                    },
                                 },
                              }}
                              disabled
                              ampm={false}
                              value={endTime}
                              viewRenderers={{
                                 hours: renderTimeViewClock,
                                 minutes: renderTimeViewClock,
                                 seconds: renderTimeViewClock,
                              }}
                           />
                        </DemoContainer>
                     </LocalizationProvider>
                  </div>
               </div>

               <div className="sm:mx-auto mt-10 max-sm:w-full">
                  <button
                     onClick={onChange}
                     className="bg-blue text-white max-sm:w-full text-2xl max-md:text-xl gilroy-medium uppercase py-4 px-20 rounded-xl"
                  >
                     Сохранить
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default IntervalSettings;
