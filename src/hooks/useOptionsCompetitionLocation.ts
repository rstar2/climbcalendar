import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { RadioOption } from "../types";

export default function useOptionsCompetitionLocation(addBG = false) {
  const { t } = useTranslation();

  const radios: RadioOption[] = useMemo(() => {
    const opts = ["balkan", "international"];
    if (addBG) opts.unshift("bg");

    return opts.map((value) => ({ value, label: t(`competition.location.${value}`) }));
  }, [t, addBG]);

  return radios;
}
