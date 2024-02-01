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

export function formatDate(competition: Date, locale?: string): string;
export function formatDate(competition: Competition, locale?: string, end?: boolean): string;
export function formatDate(dateOrCompetition: Date | Competition, locale?: string, end = false): string {
  if (dateOrCompetition instanceof Date) return formatDate_(dateOrCompetition, locale);

  if (!end) return formatDate_(dateOrCompetition.date, locale);

  const dateEnd = add(dateOrCompetition.date, {
    days: dateOrCompetition.dateDuration - 1,
  });
  return formatDate_(dateEnd, locale);
}

const options: Intl.DateTimeFormatOptions = {
  // no need to show the year it's always current one 2024
  //   year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
};
const formatDate_ = (date: Date, locale?: string) => date.toLocaleDateString(locale, options);

export const THIS_YEAR = new Date().getFullYear();
