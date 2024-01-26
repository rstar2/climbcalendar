import { missingHandling, enumForEach } from "../utils";

import { type Competition, CompetitionCategory, CompetitionType, CompetitionCategorySchema } from "../types";

export const colorMapType = (() => {
  const map = new Map<CompetitionType, string>();
  enumForEach(CompetitionType, (type) => {
    let color: string;
    switch (type) {
      case CompetitionType.Boulder:
        color = "red";
        break;
      case CompetitionType.Lead:
        color = "green";
        break;
      case CompetitionType.Speed:
        color = "blue";
        break;
      default:
        missingHandling(type);
    }
    map.set(type, color);
  });

  return map;
})();

export const colorMapCategory = (() => {
  const map = new Map<CompetitionCategory, string>();
  enumForEach(CompetitionCategorySchema.enum, (category) => {
    let color: string;

    switch (category) {
      case CompetitionCategorySchema.enum.U8:
        color = "red";
        break;
      case CompetitionCategorySchema.enum.U10:
        color = "yellow";
        break;
      case CompetitionCategorySchema.enum.U12:
        color = "blue";
        break;
      case CompetitionCategorySchema.enum.U14:
        color = "green";
        break;
      case CompetitionCategorySchema.enum.YouthA:
        color = "brown";
        break;
      case CompetitionCategorySchema.enum.YouthB:
        color = "black";
        break;
      default:
        missingHandling(category);
    }

    map.set(category, color);
  });

  return map;
})();

export function getColor(competition: Competition, key: "type" | "category" = "type"): string {
  // get the first "type" or category - it's asserted to be non-empty array
  const keyValue = competition[key][0];

  // @ts-expect-error ( it's ok )
  return (key === "type" ? getColorCompetitionType(keyValue) : getColorCompetitionCategory(keyValue)) ?? "grey";
}

export function getColorCompetitionType(type: CompetitionType) {
  return colorMapType.get(type);
}

export function getColorCompetitionCategory(category: CompetitionCategory) {
  return colorMapCategory.get(category);
}
