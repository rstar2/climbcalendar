import { Box, Divider } from "@chakra-ui/react";

import { useAuthUser } from "../cache/auth";
import { useCompetitions } from "../cache/competitions";

import Calendar from "../components/Calendar";

export default function Home() {
  const authUser = useAuthUser();

  const competitions = useCompetitions();

  return (
    <>
      <Box>{JSON.stringify(authUser)}</Box>
      <Divider my={2} />
      <Box>{JSON.stringify(competitions)}</Box>
      <Divider my={2} />
      <Calendar />
    </>
  );
}
