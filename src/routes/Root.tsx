import { Outlet } from "@tanstack/react-router";
import { Box, Container } from "@chakra-ui/react";

import "./Root.css";
import Header from "../components/Header";
import Copyright from "../components/Copyright";

export default function Root() {
  return (
    <Container maxW="90%" height="full" display="flex" flexDirection="column">
      <Header mb={2} flexShrink={0} />

      <Box flexGrow={1} overflow="auto" mb={2}>
        <Outlet />
      </Box>

      <Copyright flexShrink={0} textAlign="center" mb={4} display={["none", "block"]} />
    </Container>
  );
}
