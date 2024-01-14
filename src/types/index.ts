import { z } from "zod";
import { enumValues } from "../utils";

export enum CompetitionType {
  Boulder = "Boulder",
  Lead = "Lead",
  Speed = "Speed",
  Ninja = "Ninja",
}

export const CompetitionTypeSchema = z.nativeEnum(CompetitionType);

export const CompetitionCategorySchema = z.enum([
  "U8",
  "U10",
  "U12",
  "U14",
  "YouthA",
  "YouthB",
]);

export type CompetitionCategory = z.infer<typeof CompetitionCategorySchema>;

// export type Competition = {
//   id: string;
//   name: string;
//   type: CompetitionType | CompetitionType[];
//   date: Date;
//   category: Category[];
//   dateDuration?: number;
//   balkan?: boolean;
//   international?: boolean;
// };

export const DATE_DURATION_MIN = 1;
export const DATE_DURATION_MAX = 7;
export const CompetitionNewSchema = z.object({
  name: z
    .string({ invalid_type_error: "Not a string" })
    .min(1, "Name is required")
    .min(5, "Name is too short"),
  date: z.date({ invalid_type_error: "Not a date" }),
  dateDuration: z.coerce
    .number({ invalid_type_error: "Not a number" })
    .min(DATE_DURATION_MIN, `Min allowed is ${DATE_DURATION_MIN}`)
    .max(DATE_DURATION_MAX, `Max allowed is ${DATE_DURATION_MAX}`),
  balkan: z.boolean().optional(),
  international: z.boolean().optional(),
  //type: z.union([CompetitionTypeSchema, CompetitionTypeSchema.array().nonempty()]),
  type: CompetitionTypeSchema.array().nonempty(),
  category: CompetitionCategorySchema.array().nonempty(),
});

export type CompetitionNew = z.infer<typeof CompetitionNewSchema>;

export type Competition = CompetitionNew & {
  id: string;
};

export const TYPE_OPTIONS = enumValues(CompetitionTypeSchema.enum).map(
  (val) => ({
    value: val,
    label: val,
  })
);

export const CATEGORY_OPTIONS = enumValues(CompetitionCategorySchema.enum).map(
  (val) => ({
    value: val,
    label: val,
  })
);

// const example: Competition = {
//   id: "123456789",
//   name: "Bonsist",
//   type: [CompetitionType.Boulder],
//   date: new Date(),
//   category: ["U12", "YouthA"],
// };

export type Func = () => void;
