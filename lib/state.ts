import dayjs from "dayjs";
import { atom } from "jotai";

export const fastingStartAtom = atom<dayjs.Dayjs | null>(null);
export const fastingEndAtom = atom<dayjs.Dayjs | null>(null);
export const isFastingAtom = atom<boolean>(false);

export const isTimerFinishedAtom = atom(false);

export const bonusPointsAtom = atom(0);

export const scheduledTimeAtom = atom({
   startTime: "17:20",
   endTime: "18:00",
});

export const mealsTimeAtom = atom({
   breakfastRange: ["11:00", "20:00"],
   supperRange: ["07:00", "01:00"],
});

export const dateAtom = atom(dayjs());
