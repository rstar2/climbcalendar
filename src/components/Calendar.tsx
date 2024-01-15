import FullCalendar from "@fullcalendar/react";
import type { EventContentArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthYearPlugin from "@fullcalendar/multimonth";
import interactionPlugin from "@fullcalendar/interaction";
import { Competition } from "../types";

type CalendarProps = {
  competitions: Competition[];
};

function Calendar({ competitions }: CalendarProps) {
  return (
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
      events={[
        { title: "event 1", start: "2024-04-01" },
        { title: "event 2", start: "2024-04-02", color: "red" },
        {
          title: "event 3",
          start: "2024-04-12",
          end: "2024-04-15",
          color: "green",
        },
      ]}
    />
  );
}

export default Calendar;
