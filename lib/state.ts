import dayjs from "dayjs";
import { atom } from "jotai";

export const fastingStartAtom = atom<dayjs.Dayjs | null>(null);
export const fastingEndAtom = atom<dayjs.Dayjs | null>(null);
export const isFastingAtom = atom<boolean>(false);

export const isTimerFinishedAtom = atom(false);

export const bonusPointsAtom = atom(0);

export const scheduledTimeAtom = atom({
   startTime: "2025-02-04T18:00:00",
   endTime: "2025-02-04T08:00:00",
});

export const mealsTimeAtom = atom({
   breakfastRange: ["11:00", "20:00"],
   supperRange: ["07:00", "22:00"],
});
