import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { CompetitionCategorySchema, SelectOption } from "../types";
import { enumValues } from "../utils";

export default function useOptionsCompetitionCategory(addAny = false) {
  const { t } = useTranslation();

  const options = useMemo(() => {
    const opts: SelectOption[] = enumValues(CompetitionCategorySchema.enum).map((value) => ({
      value,
      label: t(`competition.category.${value}`),
    }));

    if (addAny)
      opts.unshift({
        value: undefined,
        label: t("any"),
      });

    return opts;
  }, [t, addAny]);

  return options;
}
