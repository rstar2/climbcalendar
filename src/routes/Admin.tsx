import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Select } from "chakra-react-select";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { Formik, Form, Field } from "formik";
import { ZodError } from "zod";

import { useAuthUser, isAdmin } from "../cache/auth";
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
import { arrayRange, mapObject, enumValues } from "../utils";
import {
  CompetitionNew,
  CompetitionNewSchema,
  DATE_DURATION_MIN,
  DATE_DURATION_MAX,
  CompetitionTypeSchema,
  CompetitionCategorySchema,
} from "../types";

/**
 * Extract the logic that handles if admin user is logged-out
 */
function useAuthAdmin() {
  // Some hooks require context from the *entire* router, not just the current route. To achieve type-safety here,
  // we must pass the `from` param to tell the hook our relative position in the route hierarchy.
  const navigate = useNavigate();
  const authUser = useAuthUser();
  useEffect(() => {
    if (!authUser) {
      navigate({ to: "/admin" });
    } else {
      isAdmin().then((isAdmin) => !isAdmin && void navigate({ to: "/" }));
    }
  }, [authUser, navigate]); // navigate is stable, but to make ESLINT happy
}

const types = enumValues(CompetitionTypeSchema.enum).map((val) => ({
  value: val,
  label: val,
}));

const categories = enumValues(CompetitionCategorySchema.enum).map((val) => ({
  value: val,
  label: val,
}));

export default function Admin() {
  // react to "admin" changes and navigate away if not authorized (not an admin) any more
  useAuthAdmin();

  return (
    <Flex align="center" justify="center" h="100vh">
      <Box
        p={6}
        rounded="md"
        // can specify different widths for the different breakpoints
        w={{
          base: "full", // 0-48em
          // sm: "full", // 30-48em
          md: "90%", // 48em-80em,
          xl: "50%", // 80em+
        }}
      >
        <Formik<Partial<CompetitionNew>>
          initialValues={{
            name: "",
            date: undefined,
            dateDuration: 2,
            balkan: false,
            international: false,
            type: undefined,
            categories: undefined,
          }}
          validate={(values) => {
            try {
              CompetitionNewSchema.parse(values);
            } catch (error) {
              if (error instanceof ZodError) {
                // return error.formErrors.fieldErrors;
                // get the first error
                return mapObject(
                  error.formErrors.fieldErrors,
                  (_key, value) => {
                    return Array.isArray(value) ? value[0] : value;
                  }
                );
              }
            }
          }}
          onSubmit={(values) => {
            alert(JSON.stringify(values, null, 2));
          }}
        >
          {({ /* values,  */ errors, touched, isValid }) => (
            <Form>
              <VStack spacing={4} align="flex-start">
                <FormControl isInvalid={!!errors.name && touched.name}>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <Field as={Input} name="name" variant="filled" />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>

                <Field name="date">
                  {({ field, form, meta }) => (
                    <FormControl
                      isInvalid={!!meta.error && meta.touched}
                      onBlur={(e) => {
                        (e.target as any).name = field.name;
                        field.onBlur(e);
                      }}
                    >
                      <FormLabel>Date</FormLabel>
                      <SingleDatepicker
                        name="date"
                        date={field.value}  
                        onDateChange={(val) =>
                          form.setFieldValue(field.name, val)
                        }
                      />
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="dateDuration">
                  {({ field, form, meta }) => (
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
                          (e.target as any).name = field.name;
                          field.onBlur(e);
                        }}
                        mb={2}
                      >
                        {arrayRange(
                          DATE_DURATION_MIN,
                          DATE_DURATION_MAX,
                          1
                        ).map((mark) => (
                          <SliderMark
                            key={mark}
                            value={mark}
                            mt="2"
                            fontSize="sm"
                          >
                            <Text
                              as={mark === field.value ? "b" : "span"}
                              color="blue.200"
                              fontSize="2xs"
                            >
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
                  {({ field, form, meta }) => (
                    <FormControl isInvalid={!!meta.error && meta.touched}>
                      <FormLabel>Type(s)</FormLabel>
                      <Select
                        name="type"
                        useBasicStyles
                        isMulti
                        options={types}
                        value={types.filter((option) =>
                          field.value?.includes(option.value) || false
                        )}
                        onChange={(options) => {
                          const values = options.map((option) => option.value);
                          form.setFieldValue(field.name, values);
                        }}
                        onBlur={(e) => {
                          (e.target as any).name = field.name;
                          field.onBlur(e);
                        }}
                      />
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="categories">
                  {({ field, form, meta }) => (
                    <FormControl isInvalid={!!meta.error && meta.touched}>
                      <FormLabel>Categories</FormLabel>
                      <Select
                        name="categories"
                        useBasicStyles
                        isMulti
                        options={categories}
                        value={categories.filter((option) =>
                          field.value?.includes(option.value) || false
                        )}
                        onChange={(options) => {
                          const values = options.map((option) => option.value);
                          form.setFieldValue(field.name, values);
                        }}
                        onBlur={(e) => {
                          (e.target as any).name = field.name;
                          field.onBlur(e);
                        }}
                      />
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field as={Checkbox} name="balkan">
                  Balkan
                </Field>
                <Field as={Checkbox} name="international">
                  International
                </Field>

                <Button
                  type="submit"
                  variant="solid"
                  width="full"
                  colorScheme="blue"
                  isDisabled={!isValid || !Object.keys(touched).length}
                >
                  Create Competition
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </Box>
    </Flex>
  );
}
