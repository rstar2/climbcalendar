import { format, add, compareAsc } from "date-fns";

const fcDateFormat = "yyyy-MM-dd";

type EventWithDate = {
  date: Date;
  dateDuration?: number;
};
export function fcDate(eventWithDate: EventWithDate): string;
export function fcDate(eventWithDate: EventWithDate, end: true): string | undefined;
export function fcDate(eventWithDate: EventWithDate, end = false): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((eventWithDate as any).category) eventWithDate.date.setHours(7);
  else eventWithDate.date.setHours(22);

  // must return string of the format "2024-04-15"
  if (!end) return format(eventWithDate.date, fcDateFormat);

  // single day - so no "end" date
  if (!eventWithDate.dateDuration || eventWithDate.dateDuration <= 1) return undefined;

  return format(add(eventWithDate.date, { days: eventWithDate.dateDuration }), fcDateFormat);
}

export function formatDate(date: Date, locale?: string): string;
export function formatDate(eventWithDate: EventWithDate, locale?: string, end?: boolean): string;
export function formatDate(dateOrEventWithDate: Date | EventWithDate, locale?: string, end = false): string {
  if (dateOrEventWithDate instanceof Date) return formatDate_(dateOrEventWithDate, locale);

  if (!end) return formatDate_(dateOrEventWithDate.date, locale);

  // single day - so no "end" date
  if (!dateOrEventWithDate.dateDuration || dateOrEventWithDate.dateDuration <= 1)
    return formatDate_(dateOrEventWithDate.date, locale);

  const dateEnd = add(dateOrEventWithDate.date, {
    days: dateOrEventWithDate.dateDuration - 1,
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

export function isDatePassed(eventWithDate: EventWithDate): boolean {
  const date = eventWithDate.dateDuration
    ? add(eventWithDate.date, {
        days: eventWithDate.dateDuration - 1,
      })
    : eventWithDate.date;

  return compareAsc(new Date(), date) === 1;
}

export const TODAY = new Date();
export const THIS_YEAR = TODAY.getFullYear();
