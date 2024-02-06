import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { EventInput, LocaleInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthYearPlugin from "@fullcalendar/multimonth";
import FullCalendar from "@fullcalendar/react";

// import bgLocale from "@fullcalendar/core/locales/bg";
// import plLocale from "@fullcalendar/core/locales/pl";
// these are just JSON with very little localized strings
// The real localization is the native JS Date formatting.
// The "code" field is important, and all the rest is not used here, so no need to import them
// {
//     code: 'bg',
//     buttonText: {
//         prev: 'назад',
//         next: 'напред',
//         today: 'днес',
//         year: 'година',
//         month: 'Месец',
//         week: 'Седмица',
//         day: 'Ден',
//         list: 'График',
//     },
//     allDayText: 'Цял ден',
//     moreLinkText(n) {
//         return '+още ' + n;
//     },
//     noEventsText: 'Няма събития за показване',
// }

import { CompetitionCategory, CompetitionType, UserEvent, type Competition } from "../types";
import { useAuthAdmin } from "../cache/auth";
import { useCompetitionAdd } from "../cache/competitions";
import { useUserEvents, useUserEventDelete, useUserEventEdit } from "../cache/userEvents";
import { fcDate } from "../utils/date";
import { getColor, getColorCompetitionType, getColorUserEvent } from "../utils/styles";
import "./ViewCalendar.css";
import DialogCompetitionAddEdit from "./competition/DialogCompetitionAddEdit";
import DialogCompetitionCreateConfirm from "./competition/DialogCompetitionCreateConfirm";
import CalendarEvent from "./CalendarEvent";
import DialogUserEventDeleteConfirm from "./userEvent/DialogUserEventDeleteConfirm";
import DialogUserEventAddEdit from "./userEvent/DialogUserEventAddEdit";

function mapCompetition(
  competition: Competition,
  mainType?: CompetitionType,
  _mainCategory?: CompetitionCategory
): EventInput {
  return {
    id: competition.id,
    title: competition.name,
    start: fcDate(competition),
    end: fcDate(competition, true),
    // color or backgroundColor use the same purpose
    color: mainType ? getColorCompetitionType(mainType) : getColor(competition, "type"),
    display: "background",
    extraProps: {
      competition,
    },
  };
}
function mapUserEvent(userEvent: UserEvent): EventInput {
  return {
    id: userEvent.id,
    title: userEvent.name,
    start: fcDate(userEvent),
    end: fcDate(userEvent, true),
    // color or backgroundColor use the same purpose
    color: getColorUserEvent(userEvent),
    extraProps: {
      isUserEvent: true,
      userEvent,
    },
  };
}

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

export default function ViewCalendar({ competitions, mainType, mainCategory, onEdit, onDelete }: ViewCalendarProps) {
  const isAdmin = useAuthAdmin();

  const addCompetitionFn = useCompetitionAdd();

  // controls the CreateConfirm dialog
  const [competitionCreateConfirm, setCompetitionCreateConfirm] = useState<Date | undefined>();

  const [competitionAdd, setCompetitionAdd] = useState<Date | undefined>();

  const [locale, setLocale] = useState<LocaleInput | undefined>();
  const { i18n } = useTranslation();
  useEffect(() => {
    // let loc: LocaleInput | undefined;
    // switch (i18n.language) {
    //   case "bg":
    //     loc = bgLocale;
    //     break;
    //   case "pl":
    //     loc = plLocale;
    //     break;
    // }
    const loc: LocaleInput = { code: i18n.language };
    setLocale(loc);
  }, [i18n.language]);

  // controls the Edit dialog for UserEvent
  const [userEventEdit, setUserEventEdit] = useState<UserEvent | undefined>();

  // controls the DeleteConfirm dialog for UserEvent
  const [userEventIdDelete, setUserEventIdDelete] = useState<string | undefined>();

  const userEvents = useUserEvents();
  const deleteUserEventFn = useUserEventDelete();
  const editUserEventFn = useUserEventEdit();

  const allEvents = competitions.map((comp) => mapCompetition(comp, mainType, mainCategory));

  // add user events if there're such
  userEvents?.forEach((userEvent) => allEvents.push(mapUserEvent(userEvent)));

  return (
    <>
      <FullCalendar
        //   height="100vh"
        height="auto"
        plugins={[dayGridPlugin, multiMonthYearPlugin, interactionPlugin]}
        //   // don't show only in the center the title (e.g. from "titleFormat" so just the year)
        //   headerToolbar={{
        //     left: "",
        //     center: "title",
        //     right: "",
        //   }}
        //   // just the year
        //   titleFormat={{ year: "numeric" }}
        // hide the default header toolbar
        headerToolbar={false}
        // show all months
        initialView="multiMonthYear"
        // start the week on Monday
        firstDay={1}
        // render-hook for rendering the event's content
        eventContent={(eventInfo) => (
          <CalendarEvent
            eventInfo={eventInfo}
            onEdit={(id, isCompetition) => {
              if (isCompetition) onEdit(id);
              else {
                const userEvent = userEvents?.find((aUserEvent) => aUserEvent.id === id);
                if (userEvent) setUserEventEdit(userEvent);
              }
            }}
            onDelete={(id, isCompetition) => {
              if (isCompetition) onDelete(id);
              else setUserEventIdDelete(id);
            }}
          />
        )}
        events={allEvents}
        // callback only for events click
        // eventClick={(info) => alert("Clicked on: " + info.event.id)}
        // eventDisplay="background"
        displayEventTime={true}
        // this callback for any date clicked
        dateClick={
          isAdmin
            ? (info) => {
                // if this same event is already "handled" as click over
                // the <CalendarEvent> popup trigger then skip it
                // @ts-expect-error (__handledAsInfoEvent is added as custom prop to the event)
                if (info.jsEvent.__handledAsInfoEvent) return;

                setCompetitionCreateConfirm(info.date);
              }
            : undefined
        }
        // locales={[enLocale, bgLocale, plLocale]}
        locale={locale}
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
