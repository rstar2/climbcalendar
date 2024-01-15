import { useEffect, useMemo } from "react";
import { useSetState } from "react-use";
import { Box, Checkbox, HStack } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { Formik, Form, Field, useFormikContext } from "formik";

import { useCompetitions } from "../cache/competitions";

import Calendar from "../components/Calendar";
import {
  CompetitionCategory,
  CompetitionType,
  TYPE_OPTIONS,
  CATEGORY_OPTIONS,
} from "../types";

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

export default function Home() {
  const competitions = useCompetitions();

  const [filter, setFilter] = useSetState(initialFilter);

  const competitionsFiltered = useMemo(() => {
    let compsFiltered = competitions ?? [];
    // use 'balkan' and 'international' flags as only filters for "checked", e.g. unchecked means ANY
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
        comp.type.includes(filter.type)
      );
    }
    if (filter.category !== undefined) {
      compsFiltered = compsFiltered.filter((comp) =>
        comp.category.includes(filter.category)
      );
    }
    return compsFiltered;
  }, [competitions, filter]);

  return (
    <>
      <Box mb={2}>
        <Filter filter={filter} setFilter={setFilter} />
        {/* <Text mb={2}>Filter : {JSON.stringify(filter)}</Text> */}
      </Box>

      <Calendar competitions={competitionsFiltered} />
    </>
  );
}

type FilterProps = {
  filter: CompetitionFilter;
  setFilter: (v: CompetitionFilter) => void;
};

function Filter({ filter, setFilter }: FilterProps) {
  return (
    <Formik<CompetitionFilter>
      initialValues={filter}
      onSubmit={(values) => {
        // keep the undefined values
        setFilter({ ...initialFilter, ...values });
      }}
    >
      <Form>
        <HStack>
          <Field name="type">
            {({ field, form }) => (
              <Select
                useBasicStyles
                options={TYPE_OPTIONS_WITH_NO_OPTION}
                value={TYPE_OPTIONS_WITH_NO_OPTION.find(
                  (option) => field.value === option.value
                )}
                onChange={(option) => {
                  form.setFieldValue(field.name, option.value);
                }}
              />
            )}
          </Field>

          <Field name="category">
            {({ field, form }) => (
              <Select
                useBasicStyles
                options={CATEGORY_OPTIONS_WITH_NO_OPTION}
                value={CATEGORY_OPTIONS_WITH_NO_OPTION.find(
                  (option) => field.value === option.value
                )}
                onChange={(option) => {
                  form.setFieldValue(field.name, option.value);
                }}
              />
            )}
          </Field>

          <Field as={Checkbox} name="balkan">
            Balkan
          </Field>
          <Field as={Checkbox} name="international">
            International
          </Field>
        </HStack>

        {/* headless component that wraps the auto-submit functionality */}
        <AutoSubmit />
      </Form>
    </Formik>
  );
}

function AutoSubmit() {
  const formik = useFormikContext();
  useEffect(() => {
    formik.submitForm();
  }, [formik.values]); // formik is stable

  return null;
}
