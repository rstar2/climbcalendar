import { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  HStack,
  Heading,
  Show,
  Spacer,
  VStack,
  useDisclosure,
  useTheme,
} from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

import { Competition } from "../types";
import { useCompetitionAdd, useCompetitionDelete, useCompetitionEdit, useCompetitions } from "../cache/competitions";
import { useViewMode } from "../cache/ui";
import { useAuthAdmin } from "../cache/auth";
import ViewCalendar from "../components/ViewCalendar";
import ViewCalendar2 from "../components/ViewCalendar2";
import ViewList from "../components/ViewList";
import ViewTable from "../components/ViewTable";
import DialogCompetitionDeleteConfirm from "../components/competition/DialogCompetitionDeleteConfirm";
import DialogCompetitionAddEdit from "../components/competition/DialogCompetitionAddEdit";
import FormFilterCompetitions, { useFormFilterCompetitions } from "../components/competition/FormFilterCompetitions";
import SelectViewMode from "../components/SelectViewMode";

export default function Home() {
  const theme = useTheme();
  const { t } = useTranslation();

  const isAuthAdmin = useAuthAdmin();
  const viewMode = useViewMode();

  const competitions = useCompetitions();
  const addCompetition = useCompetitionAdd();
  const editCompetition = useCompetitionEdit();
  const deleteCompetition = useCompetitionDelete();

  const onlyFromThisYearView = viewMode === "calendar" || viewMode === "calendar2";
  // useFormFilterCompetitions works together with FormFilterCompetition
  // TODO: think of another solution with context or render-props as now both are necessary
  const { competitionsFiltered, filter, setFilter } = useFormFilterCompetitions(onlyFromThisYearView);
  const formFilterCompetition = (
    <FormFilterCompetitions filter={filter} setFilter={setFilter} onlyFromThisYearView={onlyFromThisYearView} />
  );

  // controls the Add/Edit dialog,
  // 1. editing when Competition
  // 2. adding when Date  or true,
  // 3. closed when undefined
  const [competitionAddEdit, setCompetitionAddEdit] = useState<Competition | Date | true | undefined>();

  // controls the DeleteConfirm dialog
  const [competitionIdDelete, setCompetitionIdDelete] = useState<string | undefined>();

  const handleEditCompetition = (id: string) => {
    // open a new modal and on OK call edit
    const competition = competitions?.find((comp) => comp.id === id);
    if (competition) setCompetitionAddEdit(competition);
  };

  return (
    <>
      <VStack height="full">
        <Show above="sm">
          <HStack my={2} flexShrink={0} width="full">
            {formFilterCompetition}
            <Spacer />
          </HStack>
        </Show>
        <Show below="sm">
          <MobileDrawer>{formFilterCompetition}</MobileDrawer>
        </Show>

        <HStack mb={2} flexShrink={0} width="full" gap={2}>
          {/* show loading until competitions is valid */}
          {!competitions ? (
            <BeatLoader
              style={{ display: "inline" }}
              size={8}
              color={theme.__cssMap["colors.chakra-body-text"].value}
            />
          ) : (
            <Heading size="md">{t("competitions", { count: competitionsFiltered.length })}</Heading>
          )}

          {isAuthAdmin && (
            <Button size="sm" onClick={() => setCompetitionAddEdit(true)}>
              {t("action.add")}
            </Button>
          )}

          <Spacer/>

          <SelectViewMode />
        </HStack>

        <Box className="printable" flexGrow={1} overflow="auto" width="full">
          {viewMode === "calendar" && (
            <ViewCalendar
              competitions={competitionsFiltered}
              mainType={filter.type}
              mainCategory={filter.category}
              onEdit={handleEditCompetition}
              onDelete={setCompetitionIdDelete}
              onAddWithDate={setCompetitionAddEdit}
            />
          )}
          {viewMode === "calendar2" && (
            <ViewCalendar2
              competitions={competitionsFiltered}
              mainType={filter.type}
              mainCategory={filter.category}
              onEdit={handleEditCompetition}
              onDelete={setCompetitionIdDelete}
            />
          )}
          {viewMode === "list" && (
            <ViewList
              competitions={competitionsFiltered}
              onEdit={handleEditCompetition}
              onDelete={setCompetitionIdDelete}
            />
          )}
          {viewMode === "table" && (
            <ViewTable
              competitions={competitionsFiltered}
              onEdit={handleEditCompetition}
              onDelete={setCompetitionIdDelete}
            />
          )}
        </Box>
      </VStack>

      <DialogCompetitionDeleteConfirm
        id={competitionIdDelete}
        onConfirm={(confirmed) => {
          setCompetitionIdDelete(undefined);
          if (confirmed) deleteCompetition(competitionIdDelete!);
        }}
      />
      <DialogCompetitionAddEdit
        data={competitionAddEdit}
        onConfirm={(competitionNew) => {
          setCompetitionAddEdit(undefined);
          if (competitionAddEdit && competitionNew)
            if (competitionAddEdit instanceof Date || competitionAddEdit === true) addCompetition(competitionNew);
            else
              editCompetition({
                id: competitionAddEdit.id,
                competition: competitionNew,
              });
        }}
      />
    </>
  );
}

function MobileDrawer({ children }: React.PropsWithChildren) {
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <>
      <Button size="sm" onClick={onToggle}>
        Filter
      </Button>
      <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody>{children}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
