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
      options={VIEW_MODE_OPTIONS}
      value={VIEW_MODE_OPTIONS.find((option) => option.value === viewMode)}
      onChange={(option) => viewModeChange(option!.value)}
    />
  );
}
