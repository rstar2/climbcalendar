import { Select } from "chakra-react-select";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { Formik, Form, Field, type FieldProps } from "formik";
import { ZodError } from "zod";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  VStack,
  Text,
} from "@chakra-ui/react";

import { arrayRange, mapObject } from "../utils";
import {
  CompetitionNew,
  CompetitionNewSchema,
  DATE_DURATION_MIN,
  DATE_DURATION_MAX,
  TYPE_OPTIONS,
  CATEGORY_OPTIONS,
  Competition,
} from "../types";

type CompetitionAddEditProps = {
  /**
   * Competition fields to use
   */
  competition?: Competition;
  /**
   * Predefined date - will overwrite the date of the competition if such is passed
   */
  date?: Date;

  onAction(competition: CompetitionNew): void;
  isFullWidth?: boolean;
};
export default function CompetitionAddEdit({
  competition,
  date,
  onAction,
  isFullWidth = false,
}: CompetitionAddEditProps) {
  return (
    <Flex align="center" justify="center">
      <Box
        p={6}
        rounded="md"
        // can specify different widths for the different breakpoints
        w={
          isFullWidth
            ? "full"
            : {
                base: "full", // 0-48em
                // sm: "full", // 30-48em
                md: "90%", // 48em-80em,
                xl: "50%", // 80em+
              }
        }
      >
        <Formik<Partial<CompetitionNew>>
          initialValues={
            competition
              ? { ...competition, date }
              : {
                  name: "",
                  date: date,
                  dateDuration: 2,
                  balkan: false,
                  international: false,
                  type: undefined,
                  category: undefined,
                }
          }
          validate={(values) => {
            try {
              CompetitionNewSchema.parse(values);
            } catch (error) {
              if (error instanceof ZodError) {
                // return error.formErrors.fieldErrors;
                // get the first error
                return mapObject(error.formErrors.fieldErrors, (_key, value) => {
                  return Array.isArray(value) ? value[0] : value;
                });
              }
            }
          }}
          onSubmit={async (values, formikHelpers) => {
            // alert(JSON.stringify(values, null, 2));

            // it should be already validated
            try {
              await onAction(values as CompetitionNew);
              // reset it to initial state
              formikHelpers.resetForm();
            } finally {
              // use the Formik built-in "isSubmitting" functionality
              formikHelpers.setSubmitting(false);
            }
          }}
        >
          {({ /* values,  */ errors, touched, isValid, isSubmitting }) => (
            <Form>
              <VStack spacing={4} align="flex-start">
                <FormControl isInvalid={!!errors.name && touched.name}>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <Field as={Input} name="name" variant="filled" />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>

                <Field name="date">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl
                      isInvalid={!!meta.error && meta.touched}
                      onBlur={(e) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (e.target as any).name = field.name;
                        field.onBlur(e);
                      }}
                    >
                      <FormLabel>Date</FormLabel>
                      <SingleDatepicker
                        name="date"
                        date={field.value}
                        onDateChange={(val) => form.setFieldValue(field.name, val)}
                      />
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="dateDuration">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && meta.touched}>
                      <FormLabel>Duration</FormLabel>
                      <Slider
                        name="dateDuration"
                        min={DATE_DURATION_MIN}
                        max={DATE_DURATION_MAX}
                        step={1}
                        value={field.value}
                        // this will not work as Slider.onChange is not same as input.onChange where event is received
                        // onChange={field.onChange}
                        onChange={(val) => form.setFieldValue(field.name, val)}
                        // implement onBlur, so that "touched.xxx" to work properly
                        onBlur={(e) => {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (e.target as any).name = field.name;
                          field.onBlur(e);
                        }}
                        mb={2}
                      >
                        {arrayRange(DATE_DURATION_MIN, DATE_DURATION_MAX, 1).map((mark) => (
                          <SliderMark key={mark} value={mark} mt="2" fontSize="sm">
                            <Text as={mark === field.value ? "b" : "span"} color="blue.200" fontSize="2xs">
                              {mark}
                            </Text>
                          </SliderMark>
                        ))}
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb boxSize={3} bgColor="blue.200" />
                      </Slider>
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="type">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && meta.touched}>
                      <FormLabel>Types</FormLabel>
                      <Select
                        name="type"
                        useBasicStyles
                        isMulti
                        isSearchable={false}
                        options={TYPE_OPTIONS}
                        value={TYPE_OPTIONS.filter((option) => field.value?.includes(option.value) || false)}
                        onChange={(options) => {
                          const values = options.map((option) => option.value);
                          form.setFieldValue(field.name, values);
                        }}
                        onBlur={(e) => {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (e.target as any).name = field.name;
                          field.onBlur(e);
                        }}
                      />
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="category">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && meta.touched}>
                      <FormLabel>Categories</FormLabel>
                      <Select
                        useBasicStyles
                        isMulti
                        isSearchable={false}
                        closeMenuOnSelect={false}
                        options={CATEGORY_OPTIONS}
                        value={CATEGORY_OPTIONS.filter((option) => field.value?.includes(option.value) || false)}
                        onChange={(options) => {
                          const values = options.map((option) => option.value);
                          form.setFieldValue(field.name, values);
                        }}
                        onBlur={(e) => {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (e.target as any).name = field.name;
                          field.onBlur(e);
                        }}
                      />
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                {/* there's problem with formikHelpert.resetForm()  - it doesn't reset the chakra-ui Checkbox*/}
                {/* <Field as={Checkbox} name="balkan">
                      Balkan
                    </Field> */}
                <Field name="balkan">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && meta.touched}>
                      <Checkbox
                        isChecked={field.value}
                        onChange={(e) => form.setFieldValue(field.name, e.target.checked)}
                      >
                        Balkan
                      </Checkbox>
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="international">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && meta.touched}>
                      <Checkbox
                        isChecked={field.value}
                        onChange={(e) => form.setFieldValue(field.name, e.target.checked)}
                      >
                        International
                      </Checkbox>
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Button
                  type="submit"
                  variant="solid"
                  width="full"
                  colorScheme="blue"
                  isDisabled={
                    // when creating let at least on touched field, on edit not such need
                    isSubmitting || !isValid || (!competition && !Object.keys(touched).length)
                  }
                >
                  {competition ? "Edit Competition" : "Add Competition"}
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </Box>
    </Flex>
  );
}
