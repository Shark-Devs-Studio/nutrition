import axios from "axios";
import dayjs from "dayjs";
import { atom } from "jotai";

export const MOCK_API = "https://67a9e7e565ab088ea7e4ea63.mockapi.io";
export const userCourseAtom = atom<any>(
   axios.get(`${MOCK_API}/userCourseDaysData`).then((res) => {
      if (res.status === 200 || res.status === 201) {
         return res.data;
      }
   })
);

export const fastingStartAtom = atom<dayjs.Dayjs | null>(null);
export const fastingEndAtom = atom<dayjs.Dayjs | null>(null);
export const isFastingAtom = atom<boolean>(fastingStartAtom ? true : false);

export const isEatingAtom = atom(isFastingAtom ? false : true);

export const isTimerFinishedAtom = atom(false);

export const bonusPointsAtom = atom(0);

export const scheduledTimeAtom = atom("00:00");

export const fastingHoursAtom = atom<any>(
   axios.get(`${MOCK_API}/settings`).then((res) => {
      if (res.status === 200 || res.status === 201) {
         const active: any = res.data.filter(
            (interval: any) => interval.isActive
         );
         return active;
      }
   })
);

export const dateAtom = atom(dayjs().format("YYYY-MM-DD"));
