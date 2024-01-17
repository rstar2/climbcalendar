import { Heading } from "@chakra-ui/react";
import FullCalendar from "@fullcalendar/react";
import type { EventContentArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthYearPlugin from "@fullcalendar/multimonth";
import interactionPlugin from "@fullcalendar/interaction";
import { format as formatDate, add as addDate } from "date-fns";

import {
  CompetitionCategory,
  type Competition,
  CompetitionType,
} from "../types";

import "./Calendar.css";
import { getColor, getColorCompetitionType } from "../utils/styles";

const THIS_YEAR = new Date().getFullYear();

const fcDateFormat = "yyyy-MM-dd";
function fcDate(competition: Competition): string;
function fcDate(competition: Competition, end: true): string | undefined;
function fcDate(competition: Competition, end = false): string | undefined {
  competition.date.setHours(12);
  // must return string of the format "2024-04-15"
  if (!end) return formatDate(competition.date, fcDateFormat);

  // single day - so no "end" date
  if (competition.dateDuration <= 1) return undefined;

  return formatDate(
    addDate(competition.date, { days: competition.dateDuration }),
    fcDateFormat
  );
}

function mapCompetition(
  competition: Competition,
  mainType?: CompetitionType,
  mainCategory?: CompetitionCategory
) {
  return {
    id: competition.id,
    title: competition.name,
    start: fcDate(competition),
    end: fcDate(competition, true),
    // color or backgroundColor use the same purpose
    color: mainType? getColorCompetitionType(mainType) : getColor(competition, "type"),
    display: "background",
  };
}

type CalendarProps = {
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
};

function Calendar({ competitions, mainType, mainCategory }: CalendarProps) {
  return (
    <>
      <Heading mb={2}>
        {THIS_YEAR} ({competitions.length})
      </Heading>
      <FullCalendar
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
        // render-hook for rendering the event's content
        eventContent={(eventInfo: EventContentArg) => (
          <>
            <b>event :{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
          </>
        )}
        events={competitions.map((comp) =>
          mapCompetition(comp, mainType, mainCategory)
        )}
        // callback only for events click
        eventClick={(info) => {
          // TODO: allow edit by admin
          //   alert("Clicked on: " + info.event.id);
        }}
        eventDisplay="background"
        displayEventTime={true}

        // this callback for any date clicked
        // dateClick={(info) => {}}
      />
    </>
  );
}

export default Calendar;
