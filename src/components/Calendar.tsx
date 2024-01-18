import {
  Button,
  Flex,
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
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
import { useAuthAdmin } from "../cache/auth";

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
  _mainCategory?: CompetitionCategory
) {
  return {
    id: competition.id,
    title: competition.name,
    start: fcDate(competition),
    end: fcDate(competition, true),
    // color or backgroundColor use the same purpose
    color: mainType
      ? getColorCompetitionType(mainType)
      : getColor(competition, "type"),
    display: "background",
    extraProps: {
      competition,
    },
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

  onDelete(id: string): void;
  onEdit(id: string): void;
};

export default function Calendar({
  competitions,
  mainType,
  mainCategory,
  onEdit,
  onDelete,
}: CalendarProps) {
  return (
    <>
      <Heading mb={2} textAlign={"center"}>
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
        eventContent={(eventInfo) => (
          <CalendarEvent
            eventInfo={eventInfo}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
        events={competitions.map((comp) =>
          mapCompetition(comp, mainType, mainCategory)
        )}
        // callback only for events click
        // eventClick={(info) => alert("Clicked on: " + info.event.id)}
        eventDisplay="background"
        displayEventTime={true}

        // this callback for any date clicked
        // dateClick={(info) => {}}
      />
    </>
  );
}

type CalendarEventProps = {
  eventInfo: EventContentArg;
} & Pick<CalendarProps, "onEdit" | "onDelete">;
function CalendarEvent({ eventInfo, onDelete, onEdit }: CalendarEventProps) {
  const isAuthAdmin = useAuthAdmin();

  const { competition } = eventInfo.event.extendedProps.extraProps;

  const {
    onOpen: onOpenPopover,
    onClose: onClosePopover,
    isOpen: inOpenPopover,
  } = useDisclosure();

  const handleDelete = () => {
    // close and call parent
    onClosePopover();
    onDelete(competition.id);
  };
  const handleEdit = () => {
    // close and call parent
    onClosePopover();
    onEdit(competition.id);
  };

  return (
    <Popover
      isOpen={inOpenPopover}
      onOpen={onOpenPopover}
      onClose={onClosePopover}
    >
      <PopoverTrigger>
        <Flex
          align="center"
          justify="center"
          width="100%"
          height="100%"
          px={2}
          fontSize="xs"
        >
          <Tooltip label={eventInfo.event.title}>
            <Text noOfLines={3}>{eventInfo.event.title}</Text>
          </Tooltip>
        </Flex>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>Info</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>{JSON.stringify(competition)}</PopoverBody>
          {isAuthAdmin && (
            <PopoverFooter display="flex" justifyContent="flex-end">
              <Button mr={2} onClick={handleEdit}>
                Edit
              </Button>
              <Button colorScheme="red" onClick={handleDelete}>
                Delete
              </Button>
            </PopoverFooter>
          )}
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
