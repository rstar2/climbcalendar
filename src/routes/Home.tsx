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

import { Competition } from "../types";
import { useCompetitionDelete, useCompetitionEdit, useCompetitions } from "../cache/competitions";
import { useViewMode } from "../cache/ui";
import CompetitionsCalendar from "../components/CompetitionsCalendar";
import CompetitionsList from "../components/CompetitionsList";
import CompetitionsTable from "../components/CompetitionsTable";
import DialogCompetitionDeleteConfirm from "../components/DialogCompetitionDeleteConfirm";
import DialogCompetitionAddEdit from "../components/DialogCompetitionAddEdit";
import FormFilterCompetitions, { useFormFilterCompetitions } from "../components/FormFilterCompetitions";
import SelectViewMode from "../components/SelectViewMode";

export default function Home() {
  const theme = useTheme();

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
            <Heading size="md">{competitionsFiltered.length} competitions</Heading>
          )}

          <SelectViewMode />
        </HStack>

        <Box className="printable" flexGrow={1} overflow="auto" width="full">
          {viewMode === "calendar" && (
            <CompetitionsCalendar
              competitions={competitionsFiltered}
              mainType={filter.type}
              mainCategory={filter.category}
              onEdit={handleEditCompetition}
              onDelete={setCompetitionIdDelete}
            />
          )}
          {viewMode === "list" && (
            <CompetitionsList
              competitions={competitionsFiltered}
              onEdit={handleEditCompetition}
              onDelete={setCompetitionIdDelete}
            />
          )}
          {viewMode === "table" && (
            <CompetitionsTable
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
