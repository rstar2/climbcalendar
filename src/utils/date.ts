import { format, add } from "date-fns";
import { Competition } from "../types";

const fcDateFormat = "yyyy-MM-dd";

export function fcDate(competition: Competition): string;
export function fcDate(competition: Competition, end: true): string | undefined;
export function fcDate(competition: Competition, end = false): string | undefined {
  competition.date.setHours(12);
  // must return string of the format "2024-04-15"
  if (!end) return format(competition.date, fcDateFormat);

  // single day - so no "end" date
  if (competition.dateDuration <= 1) return undefined;

  return format(add(competition.date, { days: competition.dateDuration }), fcDateFormat);
}

export function formatDate(competition: Competition, end = false) {
  if (!end) return competition.date.toDateString();

  return add(competition.date, {
    days: competition.dateDuration - 1,
  }).toDateString();
}

export const THIS_YEAR = new Date().getFullYear();