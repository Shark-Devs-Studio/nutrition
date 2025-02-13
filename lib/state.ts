import dayjs from "dayjs";
import { atom } from "jotai";

export const fastingStartAtom = atom<dayjs.Dayjs | null>(null);
export const fastingEndAtom = atom<dayjs.Dayjs | null>(null);
export const isFastingAtom = atom<boolean>(fastingStartAtom ? true : false);

export const isTimerFinishedAtom = atom(false);

export const bonusPointsAtom = atom(0);

export const scheduledTimeAtom = atom("17:20");

export const fastingHoursAtom = atom(16);

export const settingsAtom = atom<{
   id: number;
   breackfastRange: string[];
   supperRange: string[];
} | null>(null);

export const dateAtom = atom(dayjs());
