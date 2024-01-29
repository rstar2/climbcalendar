import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { CompetitionTypeSchema, SelectOption } from "../types";
import { enumValues } from "../utils";

export default function useOptionsCompetitionType(addAny = false) {
  const { t } = useTranslation();

  const options = useMemo(() => {
    const opts: SelectOption[] = enumValues(CompetitionTypeSchema.enum).map((value) => ({
      value,
      label: t(`competition.type.${value}`),
    }));

    if (addAny)
      opts.unshift({
        value: undefined,
        label: t("any"),
      });

    return opts;
  }, [t, addAny]); // t changes when the language change

  return options;
}
