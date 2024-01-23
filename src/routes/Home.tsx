import { ElementRef, useEffect, useMemo, useRef, useState } from "react";
import { useSetState } from "react-use";
import {
  Box,
  Checkbox,
  Stack,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  AlertDialogCloseButton,
  Divider,
  useTheme,
  Heading,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { Formik, Form, Field, type FieldProps, useFormikContext } from "formik";
import { BeatLoader } from "react-spinners";

import {
  useCompetitions,
  useCompetitionDelete,
  useCompetitionEdit,
} from "../cache/competitions";

import Calendar from "../components/Calendar";
import {
  CompetitionCategory,
  CompetitionType,
  TYPE_OPTIONS,
  CATEGORY_OPTIONS,
  Competition,
  CompetitionNew,
} from "../types";
import { getColorCompetitionType } from "../utils/styles";
import CompetitionAddEdit from "../components/CompetitionAddEdit";

type CompetitionFilter = Partial<{
  balkan: boolean;
  international: boolean;
  type: CompetitionType;
  category: CompetitionCategory;
}>;

const TYPE_OPTIONS_WITH_NO_OPTION = [
  {
    value: undefined,
    label: "Any",
  },
  ...TYPE_OPTIONS,
];

const CATEGORY_OPTIONS_WITH_NO_OPTION = [
  {
    value: undefined,
    label: "Any",
  },
  ...CATEGORY_OPTIONS,
];

const initialFilter: CompetitionFilter = {
  balkan: undefined,
  international: undefined,
  type: undefined,
  category: undefined,
};

const THIS_YEAR = new Date().getFullYear();

export default function Home() {
  const theme = useTheme();

  const competitions = useCompetitions();
  const editCompetition = useCompetitionEdit();
  const deleteCompetition = useCompetitionDelete();

  const [filter, setFilter] = useSetState(initialFilter);

  const competitionsFiltered = useMemo(() => {
    let compsFiltered = competitions ?? [];

    // use 'balkan' / 'international' flags as only filters for "checked", e.g. unchecked means ANY
    if (filter.balkan) {
      compsFiltered = compsFiltered.filter(
        (comp) => filter.balkan === comp.balkan
      );
    }

    if (filter.international) {
      compsFiltered = compsFiltered.filter(
        (comp) => filter.international === comp.international
      );
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
      <Box my={4}>
        <FormCompetitionFilter filter={filter} setFilter={setFilter} />
        {/* <Text mb={2}>Filter : {JSON.stringify(filter)}</Text> */}
        <Divider mt={4} />
      </Box>

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
      <Calendar
        competitions={competitionsFiltered}
        mainType={filter.type}
        mainCategory={filter.category}
        onEdit={handleEditCompetition}
        onDelete={setCompetitionIdDelete}
      />

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

type FormCompetitionFilterProps = {
  filter: CompetitionFilter;
  setFilter: (v: CompetitionFilter) => void;
};

function FormCompetitionFilter({
  filter,
  setFilter,
}: FormCompetitionFilterProps) {
  return (
    <Formik<CompetitionFilter>
      initialValues={filter}
      onSubmit={(values) => {
        // keep the undefined values
        setFilter({ ...initialFilter, ...values });
      }}
    >
      <Form>
        {/* responsive direction - on small use as column, on bigger as row */}
        <Stack direction={["column", "row"]}>
          <Field name="type">
            {({ field, form }: FieldProps) => (
              <Select
                // useful for testing CSS styles in order to make it always open
                // menuIsOpen
                useBasicStyles
                chakraStyles={{
                  option: (provided, state) => ({
                    ...provided,
                    // @ts-expect-error (state.value actually exists, same as getValue())
                    color: getColorCompetitionType(state.value),
                  }),
                  menu: (provided) => ({
                    ...provided,

                    // make it above the FullCalendar as some of its elements have z-index:1
                    zIndex: 3,
                  }),
                }}
                // this will make the input as readonly and so on mobiles the keyboard will not be opened
                isSearchable={false}
                options={TYPE_OPTIONS_WITH_NO_OPTION}
                value={TYPE_OPTIONS_WITH_NO_OPTION.find(
                  (option) => field.value === option.value
                )}
                onChange={(option) => {
                  form.setFieldValue(field.name, option!.value);
                }}
              />
            )}
          </Field>

          <Field name="category">
            {({ field, form }: FieldProps) => (
              <Select
                useBasicStyles
                chakraStyles={{
                  menu: (provided) => ({
                    ...provided,

                    // make it above the FullCalendar as some of its elements have z-index:1
                    zIndex: 3,
                  }),
                }}
                // this will make the input as readonly and so on mobiles the keyboard will not be opened
                isSearchable={false}
                options={CATEGORY_OPTIONS_WITH_NO_OPTION}
                value={CATEGORY_OPTIONS_WITH_NO_OPTION.find(
                  (option) => field.value === option.value
                )}
                onChange={(option) => {
                  form.setFieldValue(field.name, option!.value);
                }}
              />
            )}
          </Field>

          {/* <Field as={Checkbox} name="balkan">
            Balkan
          </Field>
          <Field as={Checkbox} name="international">
            International
          </Field> */}

          {/* make it act like radio-buttons - either balkan or international could be checked */}
          <Field name="balkan">
            {({ field, form }: FieldProps) => (
              <Checkbox
                isChecked={field.value}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  form.setFieldValue(field.name, isChecked);
                  if (isChecked) form.setFieldValue("international", false);
                }}
              >
                Balkan
              </Checkbox>
            )}
          </Field>
          <Field name="international">
            {({ field, form }: FieldProps) => (
              <Checkbox
                isChecked={field.value}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  form.setFieldValue(field.name, isChecked);
                  if (isChecked) form.setFieldValue("balkan", false);
                }}
              >
                International
              </Checkbox>
            )}
          </Field>
        </Stack>

        {/* headless component that wraps the auto-submit functionality */}
        <FormAutoSubmit />
      </Form>
    </Formik>
  );
}

function FormAutoSubmit() {
  const formik = useFormikContext();
  useEffect(() => {
    formik.submitForm();
  }, [formik.values]); // formik is stable

  return null;
}

type DialogCompetitionEditProps = {
  competition?: Competition;
  onConfirm: (competitionNew?: CompetitionNew) => void;
};
function DialogCompetitionEdit({
  competition,
  onConfirm,
}: DialogCompetitionEditProps) {
  const { isOpen, onClose } = useDisclosure({
    isOpen: !!competition,
    onClose: onConfirm, // will pass undefined e.g. onConfirm(undefined)
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={"4xl"}
      scrollBehavior="inside"
      isCentered
      //   motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Competition</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <CompetitionAddEdit
            competition={competition}
            onAction={onConfirm}
            isFullWidth
          />
          ;
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

type DialogCompetitionDeleteConfirmProps = {
  id?: string;
  onConfirm: (confirmed: boolean) => void;
};
function DialogCompetitionDeleteConfirm({
  id,
  onConfirm,
}: DialogCompetitionDeleteConfirmProps) {
  const { isOpen, onClose } = useDisclosure({
    isOpen: !!id,
    onClose: () => onConfirm(false),
  });
  const cancelDeleteRef = useRef<ElementRef<"button">>(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={cancelDeleteRef}
      isCentered
      //   motionPreset="slideInBottom"
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>Delete Competition</AlertDialogHeader>

        <AlertDialogCloseButton />

        <AlertDialogBody>
          Are you sure? You can't undo this action afterwards.
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button ref={cancelDeleteRef} onClick={() => onConfirm(false)}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={() => onConfirm(true)} ml={3}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
