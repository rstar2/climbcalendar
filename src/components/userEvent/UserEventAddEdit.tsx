import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { Formik, Form, Field, type FieldProps } from "formik";
import { ZodError } from "zod";
import {
  Box,
  Button,
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
import { useTranslation } from "react-i18next";

import { arrayRange, mapObject } from "../../utils";
import {
  UserEvent,
  UserEventNew,
  UserEventNewSchema,
  DATE_DURATION_MIN,
  DATE_DURATION_MAX_USER_EVENT,
} from "../../types";

type UserEventAddEditProps = {
  /**
   * UserEvent fields to use
   */
  userEvent?: UserEvent;
  /**
   * Predefined date - will overwrite the date of the user custom event if such is passed
   */
  date?: Date;

  onAction(userEvent: UserEventNew): void;
  isFullWidth?: boolean;
};
export default function UserEventAddEdit({ userEvent, date, onAction, isFullWidth = false }: UserEventAddEditProps) {
  const { t } = useTranslation();

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
        <Formik<Partial<UserEventNew>>
          initialValues={
            userEvent
              ? date
                ? { ...userEvent, date }
                : userEvent
              : {
                  name: "",
                  date: date,
                  dateDuration: 2,
                  type: undefined,
                }
          }
          validate={(values) => {
            try {
              let valuesToCheck = values;
              // always fallback empty strings "" to undefined, so Zod to return the proper "required_error"
              // currently it's only "name" as a string type
              if (!valuesToCheck.name) {
                valuesToCheck = { ...values };
                valuesToCheck.name = undefined;
              }

              UserEventNewSchema.parse(valuesToCheck);
            } catch (error) {
              if (error instanceof ZodError) {
                // return error.formErrors.fieldErrors;
                // get the first error

                // NOTE: the ZOD errors will be already localized but
                // if something very special is needed
                // (like only for specific path/name) they can be customized here
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
              await onAction(values as UserEventNew);
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
                  <FormLabel htmlFor="name">{t("name")}</FormLabel>
                  <Field as={Input} name="name" variant="filled" />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>

                <Field name="date" key="date">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl
                      isInvalid={!!meta.error && meta.touched}
                      onBlur={(e) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (e.target as any).name = field.name;
                        field.onBlur(e);
                      }}
                    >
                      <FormLabel>{t("date")}</FormLabel>
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
                      <FormLabel>{t("duration")}</FormLabel>
                      <Slider
                        min={DATE_DURATION_MIN}
                        max={DATE_DURATION_MAX_USER_EVENT}
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
                        {arrayRange(DATE_DURATION_MIN, DATE_DURATION_MAX_USER_EVENT, 1).map((mark) => (
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

                <Button
                  mb="300px"
                  type="submit"
                  variant="solid"
                  width="full"
                  colorScheme="blue"
                  isDisabled={
                    // when creating let at least on touched field, on edit not such need
                    isSubmitting || !isValid || (!userEvent && !Object.keys(touched).length)
                  }
                >
                  {t(`action.${userEvent ? "edit" : "add"}`)}
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </Box>
    </Flex>
  );
}
