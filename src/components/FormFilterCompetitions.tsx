import React, { useEffect, useMemo } from "react";
import { Checkbox, Stack } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { Formik, Form, Field, type FieldProps, useFormikContext } from "formik";

import { getColorCompetitionType } from "../utils/styles";
import { CATEGORY_OPTIONS, CompetitionCategory, CompetitionType, TYPE_OPTIONS } from "../types";
import { useSetState } from "react-use";
import { useCompetitions } from "../cache/competitions";

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

type CompetitionFilter = Partial<{
  balkan: boolean;
  international: boolean;
  bg: boolean;
  type: CompetitionType;
  category: CompetitionCategory;
}>;

const initialCompetitionFilter: CompetitionFilter = {
  balkan: undefined,
  international: undefined,
  bg: undefined,
  type: undefined,
  category: undefined,
};

const radios: Radio[] = [
  { name: "bg", label: "BG" },
  { name: "balkan", label: "Balkan" },
  { name: "international", label: "International" },
];

type FormFilterCompetitionsProps = {
  filter: CompetitionFilter;
  setFilter: (v: CompetitionFilter) => void;
};

export default function FormFilterCompetitions({ filter, setFilter }: FormFilterCompetitionsProps) {
  return (
    <Formik<CompetitionFilter>
      initialValues={filter}
      onSubmit={(values) => {
        // keep the undefined values
        setFilter({ ...initialCompetitionFilter, ...values });
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
                value={TYPE_OPTIONS_WITH_NO_OPTION.find((option) => field.value === option.value)}
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
                value={CATEGORY_OPTIONS_WITH_NO_OPTION.find((option) => field.value === option.value)}
                onChange={(option) => {
                  form.setFieldValue(field.name, option!.value);
                }}
              />
            )}
          </Field>

          <CheckboxRadioGroup radios={radios} />
        </Stack>

        {/* headless component that wraps the auto-submit functionality */}
        <FormAutoSubmit />
      </Form>
    </Formik>
  );
}

export function useFormFilterCompetitions() {
  const competitions = useCompetitions();

  const [filter, setFilter] = useSetState(initialCompetitionFilter);
  const competitionsFiltered = useMemo(() => {
    let compsFiltered = competitions ?? [];

    // use bg/balkan/international flags as only filters for "checked", e.g. unchecked means ANY
    if (filter.bg) {
      compsFiltered = compsFiltered.filter((comp) => !comp.balkan && !comp.international);
    }

    if (filter.balkan) {
      compsFiltered = compsFiltered.filter((comp) => !!comp.balkan);
    }

    if (filter.international) {
      compsFiltered = compsFiltered.filter((comp) => !!comp.international);
    }

    if (filter.type !== undefined) {
      compsFiltered = compsFiltered.filter((comp) => comp.type.includes(filter.type!));
    }

    if (filter.category !== undefined) {
      compsFiltered = compsFiltered.filter((comp) => comp.category.includes(filter.category!));
    }
    return compsFiltered;
  }, [competitions, filter]);

  return {
    competitionsFiltered,
    filter,
    setFilter,
  };
}

function FormAutoSubmit() {
  const formik = useFormikContext();
  useEffect(() => {
    formik.submitForm();
  }, [formik.values]); // formik is stable

  return null;
}

type Radio = { name: string; label: string };
type CheckboxRadioGroupProps = {
  radios: Radio[];
};
/**
 * Make it act like radio-group that support unchecked/empty state.
 */
function CheckboxRadioGroup({ radios }: CheckboxRadioGroupProps) {
  return radios.map((radio) => (
    <React.Fragment key={radio.name}>
      <CheckboxRadio radio={radio} radios={radios} />
    </React.Fragment>
  ));
}

type CheckboxRadioProps = {
  radio: Radio;
  radios: Radio[];
};
function CheckboxRadio({ radio, radios }: CheckboxRadioProps) {
  {
    /* <Field as={Checkbox} name={radio.name}>
              {radio.label}
            </Field>*/
  }
  return (
    <Field name={radio.name}>
      {({ field, form }: FieldProps) => (
        <Checkbox
          isChecked={field.value}
          onChange={(e) => {
            const isChecked = e.target.checked;
            form.setFieldValue(field.name, isChecked);
            if (isChecked) {
              radios.forEach((aRadio) => {
                aRadio.name !== radio.name && form.setFieldValue(aRadio.name, false);
              });
            }
          }}
        >
          {radio.label}
        </Checkbox>
      )}
    </Field>
  );
}
