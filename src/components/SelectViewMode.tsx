import { Select } from "chakra-react-select";

import { useViewMode, useViewModeChange } from "../cache/ui";
import { ViewModes } from "../types";

const VIEW_MODE_OPTIONS = ViewModes.map((view) => ({
  value: view,
  label: view,
}));

export default function SelectViewMode() {
  const viewMode = useViewMode();
  const viewModeChange = useViewModeChange();
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
      options={VIEW_MODE_OPTIONS}
      value={VIEW_MODE_OPTIONS.find((option) => option.value === viewMode)}
      onChange={(option) => viewModeChange(option!.value)}
    />
  );
}
