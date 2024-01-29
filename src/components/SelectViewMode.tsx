import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Select, chakraComponents } from "chakra-react-select";
import { Icon } from "@chakra-ui/react";
import { IoCalendarOutline } from "react-icons/io5";
import { CiViewTable } from "react-icons/ci";
import { CiCircleList } from "react-icons/ci";

import { useViewMode, useViewModeChange } from "../cache/ui";
import { ViewMode, ViewModes } from "../types";
import { missingHandling } from "../utils";

// Make sure this is defined outside of the component which returns your select
// or you'll run into rendering issues
const selectComponents = {
  // @ts-expect-error ( )
  Option: ({ children, ...props }) => (
    // @ts-expect-error ( )
    <chakraComponents.Option {...props}>
      {props.data.icon} {children}
    </chakraComponents.Option>
  ),
};

export default function SelectViewMode() {
  const { t } = useTranslation();

  const viewMode = useViewMode();
  const viewModeChange = useViewModeChange();

  // on change of the language re-create the options
  const options = useMemo(() => {
    return ViewModes.reduce((res, viewMode) => {
      let icon: React.ReactNode;
      const iconsProps = { mr: 2 };
      switch (viewMode) {
        case "calendar":
          icon = <Icon as={IoCalendarOutline} {...iconsProps} />;
          break;
        case "list":
          icon = <Icon as={CiCircleList} {...iconsProps} />;
          break;
        case "table":
          icon = <Icon as={CiViewTable} {...iconsProps} />;
          break;
        default:
          missingHandling(viewMode);
      }

      res.push({ value: viewMode, label: t(`viewMode.${viewMode}`), icon });
      return res;
    }, [] as { value: string; label: string; icon: React.ReactNode }[]);
  }, [t]);
  const value = options.find((option) => option.value === viewMode);

  return (
    <Select
      size={["sm", "md"]}
      chakraStyles={{
        menu: (provided) => ({
          ...provided,

          // make it above the FullCalendar as some of its elements have z-index:1
          zIndex: 3,
        }),
      }}
      isSearchable={false}
      options={options}
      value={value}
      onChange={(option) => viewModeChange(option!.value as ViewMode)}
      components={selectComponents}
    />
  );
}
