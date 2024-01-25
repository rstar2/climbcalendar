import { useMemo, useState } from "react";
import { useSetState } from "react-use";
import { Box, useTheme, Heading, HStack, Spacer } from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";

import { Competition } from "../types";
import {
  useCompetitions,
  useCompetitionDelete,
  useCompetitionEdit,
} from "../cache/competitions";
import { useViewMode } from "../cache/ui";
import FormFilterCompetition, {
  initialCompetitionFilter,
} from "../components/FormFilterCompetition";
import DialogCompetitionDeleteConfirm from "../components/DialogCompetitionDeleteConfirm";
import DialogCompetitionEdit from "../components/DialogCompetitionEdit";
import SelectViewMode from "../components/SelectViewMode";
import CompetitionsCalendar from "../components/CompetitionsCalendar";
import CompetitionsList from "../components/CompetitionsList";
import CompetitionsTable from "../components/CompetitionsTable";

const THIS_YEAR = new Date().getFullYear();

export default function Home() {
  const theme = useTheme();

  const viewMode = useViewMode();

  const competitions = useCompetitions();
  const editCompetition = useCompetitionEdit();
  const deleteCompetition = useCompetitionDelete();

  // TODO: extract to a custom hook inside FormFilterCompetition
  const [filter, setFilter] = useSetState(initialCompetitionFilter);
  const competitionsFiltered = useMemo(() => {
    let compsFiltered = competitions ?? [];

    // use bg/balkan/international flags as only filters for "checked", e.g. unchecked means ANY
    if (filter.bg) {
      compsFiltered = compsFiltered.filter(
        (comp) => !comp.balkan && !comp.international
      );
    }

    if (filter.balkan) {
      compsFiltered = compsFiltered.filter((comp) => !!comp.balkan);
    }

    if (filter.international) {
      compsFiltered = compsFiltered.filter((comp) => !!comp.international);
    }

    if (filter.type !== undefined) {
      compsFiltered = compsFiltered.filter((comp) =>
        comp.type.includes(filter.type!)
      );
    }

    if (filter.category !== undefined) {
      compsFiltered = compsFiltered.filter((comp) =>
        comp.category.includes(filter.category!)
      );
    }
    return compsFiltered;
  }, [competitions, filter]);

  // controls the Edit dialog
  const [competitionEdit, setCompetitionEdit] = useState<
    Competition | undefined
  >();

  // controls the DeleteConfirm dialog
  const [competitionIdDelete, setCompetitionIdDelete] = useState<
    string | undefined
  >();

  const handleEditCompetition = (id: string) => {
    // open a new modal and on OK call edit
    const competition = competitions?.find((comp) => comp.id === id);
    if (competition) setCompetitionEdit(competition);
  };

  return (
    <>
      <HStack mt={4} mb={8}>
        <FormFilterCompetition filter={filter} setFilter={setFilter} />
        <Spacer />
        <SelectViewMode />
      </HStack>

      <Heading size="md" mb={2} textAlign={"center"}>
        {THIS_YEAR}
        {/* show loading until competitions is valid */}
        {!competitions ? (
          <>
            &nbsp;
            <BeatLoader
              style={{ display: "inline" }}
              size={8}
              color={theme.__cssMap["colors.chakra-body-text"].value}
            />
          </>
        ) : (
          ` (${competitionsFiltered.length} competitions)`
        )}
      </Heading>

      <Box className="printable">
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

      <DialogCompetitionDeleteConfirm
        id={competitionIdDelete}
        onConfirm={(confirmed) => {
          setCompetitionIdDelete(undefined);
          if (confirmed) deleteCompetition(competitionIdDelete!);
        }}
      />
      <DialogCompetitionEdit
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
