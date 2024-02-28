import React from "react";
import { Box } from "@chakra-ui/react";
import { add, startOfMonth, startOfYear, eachDayOfInterval, endOfMonth, getWeekOfMonth, format } from "date-fns";

type CalendarProps = {
  date: Date;
  startOnMonday: boolean;
  sixWeekMonth: boolean;

  renderYearTitle?: React.ComponentType<{ date: Date }>;
  renderMonthTitle?: React.ComponentType<{ date: Date }>;
  renderWeekTitle?: React.ComponentType<{ weekDays: Date[] }>;
  renderYear?: React.ComponentType<React.PropsWithChildren>;
  renderMonth?: React.ComponentType<React.PropsWithChildren>;
  renderWeek?: React.ComponentType<React.PropsWithChildren>;
  renderDay?: React.ComponentType<{ day?: TCalendarDay }>;
};
const Calendar: React.FC<CalendarProps> = React.memo(
  // renderProps that are as Components must be with uppercase
  ({ date, startOnMonday, sixWeekMonth, renderYearTitle: CTitle, renderYear: CYear, ...renderProps }) => {
    const months = [];
    const firstMonth = startOfYear(date);

    for (let i = 0; i < 12; i++) {
      months.push(
        <CalendarMonth
          key={i}
          date={i === 0 ? firstMonth : startOfMonth(add(firstMonth, { months: i }))}
          startOnMonday={startOnMonday}
          sixWeekMonth={sixWeekMonth}
          {...renderProps}
        />
      );
    }

    return (
      <>
        {CTitle && <CTitle date={date} />}
        {CYear ? <CYear>{months}</CYear> : <Box className="year">{months}</Box>}
      </>
    );
  }
);

type CalendarMonthProps = {
  /**
   * Starting date of the month
   */
  date: Date;
} & Pick<
  CalendarProps,
  "startOnMonday" | "sixWeekMonth" | "renderMonth" | "renderMonthTitle" | "renderWeekTitle" | "renderWeek" | "renderDay"
>;
const CalendarMonth: React.FC<CalendarMonthProps> = ({
  date,
  startOnMonday,
  sixWeekMonth,
  renderMonth: CMonth = Box,
  renderMonthTitle: CMonthTitle,
  renderWeekTitle: CWeekTitle,
  ...renderProps
}) => {
  const calendarMonth = createCalendarMonth(date, startOnMonday, sixWeekMonth);

  const monthTitle = CMonthTitle ? (
    <CMonthTitle date={date} />
  ) : (
    <Box className="monthTitle">{format(date, "MMMM")}</Box>
  );

  const weekTitle = CWeekTitle ? (
    <CWeekTitle weekDays={calendarMonth.weekDays} />
  ) : (
    <Box className="weekTitle">
      {calendarMonth.weekDays.map((date, index) => (
        <Box as="span" key={index} className="week" mr={2}>
          {format(date, "EEEEEE")}
        </Box>
      ))}
    </Box>
  );

  return (
    <>
      <CMonth className="month">
        {monthTitle}

        {weekTitle}

        {calendarMonth.weeks.map((week, index) => (
          <CalendarWeek key={index} week={week} {...renderProps} />
        ))}
      </CMonth>
    </>
  );
};

type CalendarWeekProps = {
  week: TCalendarWeek;
} & Pick<CalendarProps, "renderWeek" | "renderDay">;
const CalendarWeek: React.FC<CalendarWeekProps> = ({ week, renderWeek: CWeek = Box, ...renderProps }) => {
  return (
    <CWeek className="week">
      {week.map((day, index) => (
        <CalendarDay key={index} day={day} {...renderProps} />
      ))}
    </CWeek>
  );
};

type CalendarDayProps = {
  day?: TCalendarDay;
} & Pick<CalendarProps, "renderDay">;
const CalendarDay: React.FC<CalendarDayProps> = ({ day, renderDay: CDay }) => {
  return CDay ? (
    <CDay day={day} />
  ) : (
    <Box as="span" mr={2} className="day">
      {day?.date.getDate() || "--"}
    </Box>
  );
};

type TCalendarDay = {
  date: Date;
  isPrevMonth?: boolean;
  isNextMonth?: boolean;
};
type TCalendarWeek = TCalendarDay[];
type TCalendarMonth = {
  weekDays: Date[];
  weeks: TCalendarWeek[];
};
/**
 *
 * @param date starting date of the month "01 JAN 2024", "01 FEB 2024", .....
 * @param startOnMonday
 * @param sixWeekMonth
 */
function createCalendarMonth(date: Date, startOnMonday = true, sixWeekMonth = true): TCalendarMonth {
  // Sunday - Saturday : 0 - 6
  const monthDays = eachDayOfInterval({ start: date, end: endOfMonth(date) });

  const daysInWeek = 7;
  const weeks: TCalendarWeek[] = [];

  monthDays.forEach((day) => {
    // day of week 0-6 (Sunday-Saturday)
    let dayOfWeek = day.getDay();

    if (startOnMonday) {
      // make Monday be 0 ..., 6 be Sunday
      dayOfWeek = dayOfWeek - 1;
      if (dayOfWeek < 0) dayOfWeek = 6;
    }

    // day of month: 1-31
    // const dayOfMonth = day.getDate();

    // week of month: 1-6
    let weekOfMonth = getWeekOfMonth(day, { weekStartsOn: startOnMonday ? 1 : 0 });
    // make it start from 0 as the array index
    weekOfMonth = weekOfMonth - 1;

    // get correct week
    let week = weeks[weekOfMonth];
    if (!week) {
      week = Array.from({ length: daysInWeek }) as TCalendarWeek;
      weeks[weekOfMonth] = week;
    }
    week[dayOfWeek] = {
      date: day,
    };
  });

  // make the month always have 6 weeks
  if (sixWeekMonth) {
    if (!weeks[4]) weeks[5] = Array.from({ length: daysInWeek }) as TCalendarWeek;
    if (!weeks[5]) weeks[6] = Array.from({ length: daysInWeek }) as TCalendarWeek;
  }

  return {
    weekDays: weeks[3].map(({ date }) => date),
    weeks,
  };
}

export default Calendar;
