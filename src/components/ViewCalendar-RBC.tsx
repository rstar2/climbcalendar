import { useState } from "react";

import format from "date-fns/format";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

import { useCompetitionAdd } from "../cache/competitions";
import { useUserEventDelete, useUserEventEdit, useUserEvents } from "../cache/userEvents";
import { CompetitionCategory, CompetitionType, UserEvent, type Competition } from "../types";
import { fcDate } from "../utils/date";
import { getColor, getColorCompetitionType, getColorUserEvent } from "../utils/styles";
import "./ViewCalendar.css";
import DialogCompetitionAddEdit from "./competition/DialogCompetitionAddEdit";
import DialogCompetitionCreateConfirm from "./competition/DialogCompetitionCreateConfirm";
import DialogUserEventAddEdit from "./userEvent/DialogUserEventAddEdit";
import DialogUserEventDeleteConfirm from "./userEvent/DialogUserEventDeleteConfirm";

function mapCompetition(
  competition: Competition,
  mainType?: CompetitionType,
  _mainCategory?: CompetitionCategory
) {
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
function mapUserEvent(userEvent: UserEvent) {
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

export default function ViewCalendar({ competitions, mainType, mainCategory}: ViewCalendarProps) {

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

  const allEvents = competitions.map((comp) => mapCompetition(comp, mainType, mainCategory));

  // add user events if there're such
  // @ts-expect-error (todo)
  userEvents?.forEach((userEvent) => allEvents.push(mapUserEvent(userEvent)));

  return (
    <>
      <Calendar
      localizer={localizer}
    //   events={myEventsList}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
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
