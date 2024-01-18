import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";


import { useAuthAdmin } from "../cache/auth";

import { useCompetitionAdd } from "../cache/competitions";
import CompetitionAddEdit from "../components/CompetitionAddEdit";

/**
 * Extract the logic that handles if admin user is logged-out
 */
function useAuthAdminChange() {
  // Some hooks require context from the *entire* router, not just the current route. To achieve type-safety here,
  // we must pass the `from` param to tell the hook our relative position in the route hierarchy.
  const navigate = useNavigate();
  const isAuthAdmin = useAuthAdmin();
  useEffect(() => {
    if (!isAuthAdmin) {
      navigate({ to: "/" });
    }
  }, [isAuthAdmin, navigate]); // navigate is stable, but to make ESLINT happy
}

export default function Admin() {
  // react to "admin" changes and navigate away if not authorized (not an admin) any more
  useAuthAdminChange();

  const competitionAddFn = useCompetitionAdd();

  return (
    <CompetitionAddEdit onAction={competitionAddFn}/>
  );
}


