import { useQuery, useMutation } from "@tanstack/react-query";

import { queryClient } from "./index";
import { ViewMode, ViewModes } from "../types";

// the key in the localStorage
const viewModeKey = "viewMode";

// get current set view mode
changeViewMode((localStorage.getItem(viewModeKey) as ViewMode) || ViewModes[0]);

function changeViewMode(viewMode: ViewMode) {
  queryClient.setQueryData<ViewMode>(["ui", "view"], viewMode);
}

/**
 * Query for the View mode.
 */
export function useViewMode() {
  const { data } = useQuery({
    queryKey: ["ui", "view"],
    queryFn: () => Promise.reject(new Error("Not used")),
    enabled: false,
    staleTime: Infinity,
    initialData: ViewModes[0] as ViewMode,
  });
  return data;
}

/**
 * Change the View mode
 */
export function useViewModeChange() {
  const mutation = useMutation({
    mutationFn: async (viewMode: ViewMode) => {
      changeViewMode(viewMode);
      localStorage.setItem(viewModeKey, viewMode);
    },
  });

  // if needed can return the whole mutation, like loading, and error state
  return mutation.mutate;
}
