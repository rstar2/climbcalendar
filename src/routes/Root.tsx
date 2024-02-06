import { Outlet } from "@tanstack/react-router";
import { Box, Container } from "@chakra-ui/react";
import { useOrientation } from "react-use";

import "./Root.css";
import Header from "../components/Header";
import Copyright from "../components/Copyright";

export default function Root() {
  // this will have affect only on mobiles where the orientation can really be changed
  const orientation = useOrientation();

  return (
    <Container
      display="flex"
      flexDirection="column"
      maxW="90%"
      // when in portrait and small-devices lock it to the parent height,
      // so that the scrollable area will be the <Outlet/>,
      // otherwise leave the whole page scrollable
      // (because the Container is not with constrained height, so its children are not)
      height={{ base: orientation.type.startsWith("landscape") ? undefined : "full", md: "full" }}
    >
      <Header mb={2} flexShrink={0} />

      <Box flexGrow={1} overflow="auto" mb={2}>
        <Outlet />
      </Box>

      <Copyright flexShrink={0} textAlign="center" mb={4} display={["none", "none", "block"]} />
    </Container>
  );
}
