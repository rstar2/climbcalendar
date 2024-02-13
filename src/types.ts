import { z } from "zod";
import { makeZodI18nMap } from "zod-i18n-map";

// integrate with i18n
z.setErrorMap(
  makeZodI18nMap({
    // search first in the "zod" namespace, and if nt there use the default one "translation"
    // so this will allow the errors to be in the same en.json file together with all other keys
    ns: ["zod", "translation"],
  })
);

export enum CompetitionType {
  Boulder = "Boulder",
  Lead = "Lead",
  Speed = "Speed",
}
export const CompetitionTypeSchema = z.nativeEnum(CompetitionType);

const CompetitionCategory = ["U8", "U10", "U12", "U14", "U16", "YouthA", "YouthB"] as const;
export const CompetitionCategorySchema = z.enum(CompetitionCategory);

export type CompetitionCategory = z.infer<typeof CompetitionCategorySchema>;

export const DATE_DURATION_MIN = 1;
export const DATE_DURATION_MAX_COMPETITION = 7;
export const DATE_DURATION_MAX_USER_EVENT = 20;

/**
 * NOTE: Localization of the errors is also applied
 */
export const CompetitionNewSchema = z.object({
  name: z.string().min(3).max(100),
  date: z.date(),
  dateDuration: z.coerce.number().min(DATE_DURATION_MIN).max(DATE_DURATION_MAX_COMPETITION),
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

// const example: Competition = {
//   id: "123456789",
//   name: "Bons",
//   type: [CompetitionType.Boulder],
//   date: new Date(),
//   category: ["U12", "YouthA"],
// };

export type Func = () => void;

export const ViewModes = ["calendar", "table", "list"] as const;
export type ViewMode = (typeof ViewModes)[number];

export type SelectOption = {
  value?: string;
  label: string;
};
export type RadioOption = Required<SelectOption>;

/**
 * NOTE: Localization of the errors is also applied
 */
export const UserEventNewSchema = z.object({
  name: z.string().min(3).max(100),
  date: z.date(),
  dateDuration: z.coerce.number().min(DATE_DURATION_MIN).max(DATE_DURATION_MAX_USER_EVENT),
  type: z.string().optional(),
});

export type UserEventNew = z.infer<typeof UserEventNewSchema>;
// export type UserEventNew = {
//     name: string;
//     date: Date;
//     dateDuration: number;
//     type?: string;
// }

export type UserEvent = UserEventNew & {
  id: string;
};
