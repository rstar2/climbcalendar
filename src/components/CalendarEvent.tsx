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
import { useTranslation } from "react-i18next";
import type { EventContentArg } from "@fullcalendar/core";

import { useAuthAdmin } from "../cache/auth";
import { formatDate } from "../utils/date";
import { Competition, UserEvent } from "../types";
import { assertDefined } from "../utils";

type CalendarEventProps = {
  eventInfo: EventContentArg;
  onDelete(id: string, isCompetition: boolean): void;
  onEdit(id: string, isCompetition: boolean): void;
};

export default function CalendarEvent({ eventInfo, onDelete, onEdit }: CalendarEventProps) {
  const { t, i18n } = useTranslation();
  const isAuthAdmin = useAuthAdmin();
  const { onOpen: onOpenPopover, onClose: onClosePopover, isOpen: inOpenPopover } = useDisclosure();

  // either competition or userEvent is valid
  const { competition, userEvent } = eventInfo.event.extendedProps.extraProps as {
    competition?: Competition;
    userEvent?: UserEvent;
  };
  const event = competition || userEvent;
  assertDefined(event);

  const handleDelete = () => {
    // close and call parent - no need for popups, but anyway
    onClosePopover();
    onDelete(event.id, !!competition);
  };
  const handleEdit = () => {
    // close and call parent - no need for popups, but anyway
    onClosePopover();
    onEdit(event.id, !!competition);
  };

  return (
    <Popover isOpen={inOpenPopover} onOpen={onOpenPopover} onClose={onClosePopover}>
      <PopoverTrigger>
        <Flex
          align="center"
          justify="center"
          width="100%"
          height="100%"
          px={2}
          fontSize="xs"
          onMouseUp={(e) => {
            // listen here are this native JS "MouseUp" event is also the trigger of the FullCalendar.dateClick()
            // so add some custom flag to the native JS event and in FullCalendar.dateClick() filter these events
            // @ts-expect-error (__handledAsInfoEvent is added as custom prop to the event)
            e.nativeEvent.__handledAsInfoEvent = true;
          }}
        >
          <Tooltip label={eventInfo.event.title}>
            <Text noOfLines={3}>{eventInfo.event.title}</Text>
          </Tooltip>
        </Flex>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>{t("info")}</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <Card variant="outline">
              <CardBody>
                <TableContainer>
                  <Table size="sm">
                    <Tbody>
                      <Tr>
                        <Td fontWeight={"bold"}>{t("name")}</Td>
                        <Td>{event.name}</Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight={"bold"}>{t("date")}</Td>
                        <Td>{formatDate(event, i18n.language)}</Td>
                      </Tr>
                      {event.dateDuration > 1 && (
                        <Tr>
                          <Td fontWeight={"bold"}>{t("dateEnd")}</Td>
                          <Td>{formatDate(event, i18n.language, true)}</Td>
                        </Tr>
                      )}
                      {competition && (
                        <>
                          <Tr>
                            <Td fontWeight={"bold"}>{t("type")}</Td>
                            <Td>{competition.type.map((typ) => t(`competition.type.${typ}`)).join(", ")}</Td>
                          </Tr>
                          <Tr>
                            <Td fontWeight={"bold"}>{t("category")}</Td>
                            <Td>{competition.category.map((cat) => t(`competition.category.${cat}`)).join(", ")}</Td>
                          </Tr>
                          {competition.balkan && (
                            <Tr>
                              <Td colSpan={2} fontWeight={"bold"}>
                                {t("competition.location.balkan")}
                              </Td>
                            </Tr>
                          )}
                          {competition.international && (
                            <Tr>
                              <Td colSpan={2} fontWeight={"bold"}>
                                {t("competition.location.international")}
                              </Td>
                            </Tr>
                          )}
                        </>
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>
          </PopoverBody>
          {(userEvent || isAuthAdmin) && (
            <PopoverFooter display="flex" justifyContent="flex-end">
              <Button mr={2} onClick={handleEdit}>
                {t("action.edit")}
              </Button>
              <Button colorScheme="red" onClick={handleDelete}>
                {t("action.delete")}
              </Button>
            </PopoverFooter>
          )}
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
