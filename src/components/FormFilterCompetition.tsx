import { useEffect } from "react";
import { Checkbox, Stack } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { Formik, Form, Field, type FieldProps, useFormikContext } from "formik";

import { getColorCompetitionType } from "../utils/styles";
import {
  CATEGORY_OPTIONS,
  CompetitionCategory,
  CompetitionType,
  TYPE_OPTIONS,
} from "../types";

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

export const initialCompetitionFilter: CompetitionFilter = {
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

type FormFilterCompetitionProps = {
  filter: CompetitionFilter;
  setFilter: (v: CompetitionFilter) => void;
};

export default function FormFilterCompetition({
  filter,
  setFilter,
}: FormFilterCompetitionProps) {
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

          <CheckboxRadioGroup radios={radios} />
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

type Radio = { name: string; label: string };
type CheckboxRadioGroupProps = {
  radios: Radio[];
};
/**
 * Make it act like radio-group that support unchecked/empty state. 
 */
function CheckboxRadioGroup({ radios }: CheckboxRadioGroupProps) {
  return radios.map((radio) => <CheckboxRadio radio={radio} radios={radios} />);
}

type CheckboxRadioProps = {
  radio: Radio;
  radios: Radio[];
};
function CheckboxRadio({ radio, radios }: CheckboxRadioProps) {
     {/* <Field as={Checkbox} name={radio.name}>
              {radio.label}
            </Field>*/}
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
                aRadio.name !== radio.name &&
                  form.setFieldValue(aRadio.name, false);
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
