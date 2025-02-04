import { atom } from "jotai";

// Атомы для времени начала и окончания
export const fastingStartAtom = atom("01:00");
export const fastingEndAtom = atom("07:00");

// Атом для управления таймером (запущен или нет)
export const isRunningAtom = atom(false);

// Атом, отслеживающий, закончилось ли время голодания
export const fastingEndedAtom = atom(false);

// Атом, отслеживающий, изменял ли пользователь время вручную
export const userChangedTimeAtom = atom(false);

// Атом для бонусов
export const bonusPointsAtom = atom(0);

// Тестовый атом для запланированного времени (из бэка)
export const scheduledTimeAtom = atom({
   startTime: "02:30",
   endTime: "18:45",
});

export const mealsTimeAtom = atom({
   breakfastRange: ["01:00", "03:00"],
   supperRange: ["07:00", "14:00"],
});
