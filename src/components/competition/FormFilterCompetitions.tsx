import React, { useCallback, useEffect, useMemo } from "react";
import { useLocalStorage, useSetState } from "react-use";
import { Checkbox, Stack } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { Formik, Form, Field, type FieldProps, useFormikContext } from "formik";

import { getColorCompetitionType } from "../../utils/styles";
import { CompetitionCategory, CompetitionType, RadioOption } from "../../types";

import { useCompetitions } from "../../cache/competitions";
import useOptionsCompetitionType from "../../hooks/useOptionsCompetitionType";
import useOptionsCompetitionCategory from "../../hooks/useOptionsCompetitionCategory";
import useOptionsCompetitionLocation from "../../hooks/useOptionsCompetitionLocation";

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

type FormFilterCompetitionsProps = {
  filter: CompetitionFilter;
  setFilter: (v: CompetitionFilter) => void;
};

export default function FormFilterCompetitions({ filter, setFilter }: FormFilterCompetitionsProps) {
  const optionsType = useOptionsCompetitionType(true);
  const optionsCategory = useOptionsCompetitionCategory(true);
  const radiosLocation = useOptionsCompetitionLocation(true);

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
                options={optionsType}
                value={optionsType.find((option) => field.value === option.value)}
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
                options={optionsCategory}
                value={optionsCategory.find((option) => field.value === option.value)}
                onChange={(option) => {
                  form.setFieldValue(field.name, option!.value);
                }}
              />
            )}
          </Field>

          <CheckboxRadioGroup radios={radiosLocation} />
        </Stack>

        {/* headless component that wraps the auto-submit functionality */}
        <FormAutoSubmit />
      </Form>
    </Formik>
  );
}

export function useFormFilterCompetitions() {
  const competitions = useCompetitions();

  // load the stored value from localStorage
  const [storedFilterStr, storeFilterStr] = useLocalStorage("competitionFilter");

  // @ts-expect-error (the useSetState.d.ts don't specify that it allows initialization function)
  const [filter, setFilter] = useSetState<CompetitionFilter>(() => {
    let storedFilter;
    if (storedFilterStr) {
      try {
        storedFilter = JSON.parse(storedFilterStr as string);
      } catch {
        // do nothing
      }
    }
    return { ...initialCompetitionFilter, ...storedFilter } as CompetitionFilter;
  });
  const setFilterMemo = useCallback<(_: CompetitionFilter) => void>(
    (aFilter) => {
      setFilter(aFilter);
      // store also in the localStorage
      storeFilterStr(JSON.stringify(aFilter));
    },
    [setFilter, storeFilterStr]
  );

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
    setFilter: setFilterMemo,
  };
}

function FormAutoSubmit() {
  const formik = useFormikContext();
  useEffect(() => {
    formik.submitForm();
  }, [formik.values]); // formik is stable

  return null;
}

type CheckboxRadioGroupProps = {
  radios: RadioOption[];
};
/**
 * Make it act like radio-group that support unchecked/empty state.
 */
function CheckboxRadioGroup({ radios }: CheckboxRadioGroupProps) {
  return radios.map((radio) => (
    <React.Fragment key={radio.value}>
      <CheckboxRadio radio={radio} radios={radios} />
    </React.Fragment>
  ));
}

type CheckboxRadioProps = {
  radio: RadioOption;
  radios: RadioOption[];
};
function CheckboxRadio({ radio, radios }: CheckboxRadioProps) {
  {
    /* <Field as={Checkbox} name={radio.name}>
              {radio.label}
            </Field>*/
  }
  return (
    <Field name={radio.value}>
      {({ field, form }: FieldProps) => (
        <Checkbox
          isChecked={field.value}
          onChange={(e) => {
            const isChecked = e.target.checked;
            form.setFieldValue(field.name, isChecked);
            if (isChecked) {
              radios.forEach((aRadio) => {
                aRadio.value !== radio.value && form.setFieldValue(aRadio.value, false);
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
