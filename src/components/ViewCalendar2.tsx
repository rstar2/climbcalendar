import { useMemo, useState } from "react";
import { Box, Grid, GridItem, Text, useBreakpointValue } from "@chakra-ui/react";

import { useCompetitionAdd } from "../cache/competitions";
import { useUserEventDelete, useUserEventEdit, useUserEvents } from "../cache/userEvents";
import { CompetitionCategory, CompetitionType, UserEvent, type Competition } from "../types";
import { TODAY } from "../utils/date";
// import { getColor, getColorCompetitionType, getColorUserEvent } from "../utils/styles";
import Calendar from "./Calendar";
import "./ViewCalendar.css";
import DialogCompetitionAddEdit from "./competition/DialogCompetitionAddEdit";
import DialogCompetitionCreateConfirm from "./competition/DialogCompetitionCreateConfirm";
import DialogUserEventAddEdit from "./userEvent/DialogUserEventAddEdit";
import DialogUserEventDeleteConfirm from "./userEvent/DialogUserEventDeleteConfirm";
import i18nUtil from "../i18n";
import { addDays, isSameDay, isWithinInterval } from "date-fns";
import CalendarEvent from "./CalendarEvent";

type CalendarEvent = {
  date: Date;
  dateEnd?: Date;
  data: Competition | UserEvent;
};
type ViewCalendarProps = {
  /**
   * The competitions to show
   */
  competitions: Competition[];

  /**
   * Main type to use when determining colors, because competition could have multiple types
   */
  mainType?: CompetitionType;

  /**
   * Main category to use when determining colors, because competition could have multiple categories
   */
  mainCategory?: CompetitionCategory;

  onDelete(id: string): void;
  onEdit(id: string): void;
};

export default function ViewCalendar({ competitions /* , mainType, mainCategory */ }: ViewCalendarProps) {
  const sixWeekMonth = useBreakpointValue({ base: false, xs: false, sm: true }, { fallback: "base" }) as boolean;

  const addCompetitionFn = useCompetitionAdd();

  // controls the CreateConfirm dialog
  const [competitionCreateConfirm, setCompetitionCreateConfirm] = useState<Date | undefined>();

  const [competitionAdd, setCompetitionAdd] = useState<Date | undefined>();

  // controls the Edit dialog for UserEvent
  const [userEventEdit, setUserEventEdit] = useState<UserEvent | undefined>();

  // controls the DeleteConfirm dialog for UserEvent
  const [userEventIdDelete, setUserEventIdDelete] = useState<string | undefined>();

  const userEvents = useUserEvents();
  const deleteUserEventFn = useUserEventDelete();
  const editUserEventFn = useUserEventEdit();

  const allEvents = useMemo(() => {
    const all: CalendarEvent[] = competitions.map((comp) => ({
      date: comp.date,
      dateEnd: comp.dateDuration === 1 ? undefined : addDays(comp.date, comp.dateDuration),
      data: comp,
    }));

    userEvents?.forEach((userEvent) =>
      all.push({
        date: userEvent.date,
        dateEnd: userEvent.dateDuration === 1 ? undefined : addDays(userEvent.date, userEvent.dateDuration),
        data: userEvent,
      })
    );

    return all;
  }, [competitions, userEvents]);

  const brandColor = "brand.400";
  return (
    <>
      <Calendar
        date={TODAY}
        startOnMonday
        sixWeekMonth={sixWeekMonth}
        // renderTitle={({date}) => format(date, "YYY")}
        renderMonthTitle={({ date }) => (
          <Text textAlign="center" bgColor="brand.900" textTransform="capitalize">
            {date.toLocaleDateString(i18nUtil.currentLanguage, { month: "long" })}
          </Text>
        )}
        renderWeekTitle={({ weekDays }) => (
          <Grid
            templateColumns="repeat(7, 1fr)"
            fontWeight="bold"
            color={brandColor}
            borderY="solid 1px"
            borderColor={brandColor}
            textTransform="capitalize"
          >
            {weekDays.map((date, index) => (
              <Box key={index} as="span" textAlign="center">
                {date.toLocaleDateString(i18nUtil.currentLanguage, { weekday: "short" })}
              </Box>
            ))}
          </Grid>
        )}
        renderYear={({ children }) => (
          <Grid
            templateColumns={["repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
            gap={6}
            paddingRight={[0, 0, 6]}
          >
            {children}
          </Grid>
        )}
        renderMonth={({ children }) => (
          <GridItem w="100%" border="solid 2px" borderColor={brandColor}>
            {children}
          </GridItem>
        )}
        renderWeek={({ children }) => <Grid templateColumns="repeat(7, 1fr)">{children}</Grid>}
        renderDay={({ day }) => {
          const date = day?.date;

          let children;
          if (!date) {
            children = "--" /* <>&nbsp;</> */;
          } else {
            const eventsOnDate = getEventsOnDate(date, allEvents);

            if (!eventsOnDate.length) children = date.getDate();
            else {
              // TODO: use the events on this date
              children = date.getDate() + " - " + eventsOnDate.length;
            }
          }

          return (
            <GridItem display="flex" justifyContent="center" alignItems="center" aspectRatio="1">
              {children}
            </GridItem>
          );
        }}
      />

      <DialogCompetitionCreateConfirm
        date={competitionCreateConfirm}
        onConfirm={(isConfirmed) => {
          // close dialog
          setCompetitionCreateConfirm(undefined);
          // open real "add" dialog
          if (isConfirmed) setCompetitionAdd(competitionCreateConfirm!);
        }}
      />
      <DialogCompetitionAddEdit
        date={competitionAdd}
        onConfirm={(competitionNew) => {
          // close dialog
          setCompetitionAdd(undefined);
          // send event
          if (competitionNew) addCompetitionFn(competitionNew);
        }}
      />

      <DialogUserEventDeleteConfirm
        id={userEventIdDelete}
        onConfirm={(confirmed) => {
          setUserEventIdDelete(undefined);
          if (confirmed) deleteUserEventFn(userEventIdDelete!);
        }}
      />
      <DialogUserEventAddEdit
        userEvent={userEventEdit}
        onConfirm={(userEventNew) => {
          setUserEventEdit(undefined);
          if (userEventNew)
            editUserEventFn({
              ...userEventNew,
              id: userEventEdit!.id,
            });
        }}
      />
    </>
  );
}

/**
 *
 * @param date
 * @param events
 * @return can be empty if no events on this date
 */
function getEventsOnDate(date: Date, events: CalendarEvent[]): EventsOnDate {
  const eventsOnDate = events.reduce((res, event) => {
    if (isSameDay(date, event.date)) {
      if (!event.dateEnd) res.push({ "single-date": event });
      else res.push({ "start-date": event });
    } else if (event.dateEnd) {
      if (isSameDay(date, event.dateEnd)) res.push({ "end-date": event });
      else if (isWithinInterval(date, { start: event.date, end: event.dateEnd })) res.push({ "middle-date": event });
    }

    return res;
  }, [] as EventsOnDate);
  return eventsOnDate;
}

// const asd: DateCheck = [{"single-date" : 1}, {"single-date" : 2}, {"middle-date" : 3}];
// console.log(asd)

type EventOnDateType = "single-date" | "start-date" | "middle-date" | "end-date";

type EventsOnDate = Partial<{
  [key in EventOnDateType]: CalendarEvent;
}>[];
