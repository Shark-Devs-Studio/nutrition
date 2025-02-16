import axios from "axios";
import dayjs from "dayjs";
import { atom } from "jotai";

export const fastingStartAtom = atom<dayjs.Dayjs | null>(null);
export const fastingEndAtom = atom<dayjs.Dayjs | null>(null);
export const isFastingAtom = atom<boolean>(fastingStartAtom ? true : false);

export const isEatingAtom = atom(isFastingAtom ? false : true);

export const isTimerFinishedAtom = atom(false);

export const bonusPointsAtom = atom(0);

export const scheduledTimeAtom = atom("00:00");

export const fastingHoursAtom = atom(
   axios
      .get(`${process.env.NEXT_PUBLIC_MOCK_API_SECRET}/settings`)
      .then((res) => {
         if (res.status === 200 || res.status === 201) {
            const active: any = res.data.filter(
               (interval: any) => interval.isActive
            );
            return active;
         }
      })
);

export const dateAtom = atom(dayjs());
