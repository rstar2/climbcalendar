import {
  Button,
  Card,
  CardBody,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import FullCalendar from "@fullcalendar/react";
import type { EventContentArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthYearPlugin from "@fullcalendar/multimonth";
import interactionPlugin from "@fullcalendar/interaction";

import { CompetitionCategory, type Competition, CompetitionType } from "../types";

import "./Calendar.css";
import { getColor, getColorCompetitionType } from "../utils/styles";
import { useAuthAdmin } from "../cache/auth";
import { fcDate, formatDate } from "../utils/date";

function mapCompetition(competition: Competition, mainType?: CompetitionType, _mainCategory?: CompetitionCategory) {
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

type CompetitionsCalendarProps = {
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

export default function CompetitionsCalendar({
  competitions,
  mainType,
  mainCategory,
  onEdit,
  onDelete,
}: CompetitionsCalendarProps) {
  return (
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
      eventContent={(eventInfo) => <CalendarEvent eventInfo={eventInfo} onEdit={onEdit} onDelete={onDelete} />}
      events={competitions.map((comp) => mapCompetition(comp, mainType, mainCategory))}
      // callback only for events click
      // eventClick={(info) => alert("Clicked on: " + info.event.id)}
      eventDisplay="background"
      displayEventTime={true}

      // this callback for any date clicked
      // dateClick={(info) => {}}
    />
  );
}

type CalendarEventProps = {
  eventInfo: EventContentArg;
} & Pick<CompetitionsCalendarProps, "onEdit" | "onDelete">;
function CalendarEvent({ eventInfo, onDelete, onEdit }: CalendarEventProps) {
  const isAuthAdmin = useAuthAdmin();

  const { competition } = eventInfo.event.extendedProps.extraProps as {
    competition: Competition;
  };

  const { onOpen: onOpenPopover, onClose: onClosePopover, isOpen: inOpenPopover } = useDisclosure();

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
    <Popover isOpen={inOpenPopover} onOpen={onOpenPopover} onClose={onClosePopover}>
      <PopoverTrigger>
        <Flex align="center" justify="center" width="100%" height="100%" px={2} fontSize="xs">
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
          <PopoverBody>
            <Card variant="outline">
              <CardBody>
                <TableContainer>
                  <Table size="sm">
                    <Tbody>
                      <Tr>
                        <Td fontWeight={"bold"}>Name</Td>
                        <Td>{competition.name}</Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight={"bold"}>Date</Td>
                        <Td>{formatDate(competition)}</Td>
                      </Tr>
                      {competition.dateDuration > 1 && (
                        <Tr>
                          <Td fontWeight={"bold"}>Date End</Td>
                          <Td>{formatDate(competition, true)}</Td>
                        </Tr>
                      )}
                      <Tr>
                        <Td fontWeight={"bold"}>Type</Td>
                        <Td>{competition.type.join(", ")}</Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight={"bold"}>Category</Td>
                        <Td>{competition.category.join(", ")}</Td>
                      </Tr>
                      {competition.balkan && (
                        <Tr>
                          <Td colSpan={2} fontWeight={"bold"}>
                            Balkan competition
                          </Td>
                        </Tr>
                      )}
                      {competition.international && (
                        <Tr>
                          <Td colSpan={2} fontWeight={"bold"}>
                            International competition
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>
          </PopoverBody>
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
