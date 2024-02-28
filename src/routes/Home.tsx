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
import { useCompetitionDelete, useCompetitionEdit, useCompetitions } from "../cache/competitions";
import { useViewMode } from "../cache/ui";
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

  const viewMode = useViewMode();

  const competitions = useCompetitions();
  const editCompetition = useCompetitionEdit();
  const deleteCompetition = useCompetitionDelete();

  // useFormFilterCompetitions works together with FormFilterCompetition
  // TODO: can think of another solution with context or render-props as now both are necessary
  const { competitionsFiltered, filter, setFilter } = useFormFilterCompetitions();
  const formFilterCompetition = <FormFilterCompetitions filter={filter} setFilter={setFilter} />;

  // controls the Edit dialog
  const [competitionEdit, setCompetitionEdit] = useState<Competition | undefined>();

  // controls the DeleteConfirm dialog
  const [competitionIdDelete, setCompetitionIdDelete] = useState<string | undefined>();

  const handleEditCompetition = (id: string) => {
    // open a new modal and on OK call edit
    const competition = competitions?.find((comp) => comp.id === id);
    if (competition) setCompetitionEdit(competition);
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

        <HStack mb={2} flexShrink={0} width="full" justifyContent="space-between">
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
        competition={competitionEdit}
        onConfirm={(competitionNew) => {
          setCompetitionEdit(undefined);
          if (competitionNew)
            editCompetition({
              id: competitionEdit!.id,
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
