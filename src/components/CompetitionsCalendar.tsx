import { useState, useEffect } from "react";
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
import type { EventContentArg, LocaleInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthYearPlugin from "@fullcalendar/multimonth";
import interactionPlugin from "@fullcalendar/interaction";

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

import { CompetitionCategory, type Competition, CompetitionType } from "../types";

import "./Calendar.css";
import { getColor, getColorCompetitionType } from "../utils/styles";
import { fcDate, formatDate } from "../utils/date";
import { useAuthAdmin } from "../cache/auth";
import { useCompetitionAdd } from "../cache/competitions";
import DialogCompetitionCreateConfirm from "./DialogCompetitionCreateConfirm";
import DialogCompetitionAddEdit from "./DialogCompetitionAddEdit";
import { useTranslation } from "react-i18next";

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
  const isAdmin = useAuthAdmin();

  const competitionAddFn = useCompetitionAdd();

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
        eventContent={(eventInfo) => <CalendarEvent eventInfo={eventInfo} onEdit={onEdit} onDelete={onDelete} />}
        events={competitions.map((comp) => mapCompetition(comp, mainType, mainCategory))}
        // callback only for events click
        // eventClick={(info) => alert("Clicked on: " + info.event.id)}
        eventDisplay="background"
        displayEventTime={true}
        // TODO: Fix - if it's also an event then first Info dialog is shown and then this one
        // this callback for any date clicked
        // dateClick={(info) => {
        //   if (isAdmin) {
        //     setCompetitionCreateConfirm(info.date);
        //   }
        // }}

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
          if (competitionNew) competitionAddFn(competitionNew);
        }}
      />
    </>
  );
}

type CalendarEventProps = {
  eventInfo: EventContentArg;
} & Pick<CompetitionsCalendarProps, "onEdit" | "onDelete">;
function CalendarEvent({ eventInfo, onDelete, onEdit }: CalendarEventProps) {
  const { t, i18n } = useTranslation();
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
                        <Td>{competition.name}</Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight={"bold"}>{t("date")}</Td>
                        <Td>{formatDate(competition, i18n.language)}</Td>
                      </Tr>
                      {competition.dateDuration > 1 && (
                        <Tr>
                          <Td fontWeight={"bold"}>{t("dateEnd")}</Td>
                          <Td>{formatDate(competition, i18n.language, true)}</Td>
                        </Tr>
                      )}
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
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>
          </PopoverBody>
          {isAuthAdmin && (
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
