"use client";

import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import { PiSunHorizonFill, PiSunFill, PiMoonFill } from "react-icons/pi";

dayjs.extend(calendar);

export const parsedDateIcon = (date: string | Date) => {
  const hour = dayjs(date).hour();
  const size = 16;

  if (hour >= 5 && hour < 12) {
    return <PiSunHorizonFill size={size} color="#DA3D20" />;
  } else if (hour >= 12 && hour < 18) {
    return <PiSunFill size={size} color="#FFC300" />;
  } else {
    return <PiMoonFill size={size} color="#3D45AA" />;
  }
};

export const formatDate = (date: string | Date) => {
  return dayjs(date).calendar(null, {
    sameDay: "[Today]",
    lastDay: "[Yesterday]",
    lastWeek: "ddd, MMM D",
    sameElse: "ddd, MMM D",
  });
};

export const formatterTHB = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
});
