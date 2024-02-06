import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { useAuthAdmin, useAuthUser } from "../cache/auth";
import { useCompetitionAdd } from "../cache/competitions";
import { useUserEventAdd } from "../cache/userEvents";
import CompetitionAddEdit from "../components/competition/CompetitionAddEdit";
import UserEventAddEdit from "../components/userEvent/UserEventAddEdit";


export default function Add() {
  const { i18n } = useTranslation();
  const isAuthAdmin = useAuthAdmin();

  return (
    <Tabs height="full">
      <TabList>
        {isAuthAdmin && <Tab>{i18n.t("competition.title")}</Tab>}
        <Tab>{i18n.t("userEvent")}</Tab>
      </TabList>

      <TabPanels>
        {isAuthAdmin && (
          <TabPanel>
            <CompetitionAdd />
          </TabPanel>
        )}

        <TabPanel>
          <UserEventAdd />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

function CompetitionAdd() {
  // react to "admin" changes and navigate away if not authorized as an admin any more
  useAuthAdminChange();

  const competitionAddFn = useCompetitionAdd();

  return <CompetitionAddEdit onAction={competitionAddFn} />;
}

function UserEventAdd() {
  // react to "auth" changes and navigate away if not authorized any more
  useAuthChange();

  const userEventAddFn = useUserEventAdd();

  return <UserEventAddEdit onAction={userEventAddFn} />;
}

/**
 * Extract the logic that handles if admin user is logged-out
 */
function useAuthChange() {
  // Some hooks require context from the *entire* router, not just the current route. To achieve type-safety here,
  // we must pass the `from` param to tell the hook our relative position in the route hierarchy.
  const navigate = useNavigate();
  const authUser = useAuthUser();
  useEffect(() => {
    if (!authUser.user) {
      navigate({ to: "/" });
    }
  }, [authUser.user, navigate]); // navigate is stable, but to make ESLINT happy
}

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
