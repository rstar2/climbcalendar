import React from "react";

import { Box, Link, Text, type BoxProps } from "@chakra-ui/react";

export default function Copyright(props: BoxProps): React.ReactElement {
  // TODO: make it work better - for now don't show it
  return React ? (
    <></>
  ) : (
    <Box
      position="fixed"
      bottom={0}
      left="50%"
      transform="translateX(-50%)"
      py={4}
      {...props}
    >
      <Text variant="body2" align="center">
        {"Copyright © "}
        <Link href="https://github.com/rstar2/" target="_blank">
          Rumen Neshev
        </Link>
        {" " + new Date().getFullYear()}
      </Text>
    </Box>
  );
}
