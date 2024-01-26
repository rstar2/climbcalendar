import { Box, Link, Text, type BoxProps } from "@chakra-ui/react";
import { THIS_YEAR } from "../utils/date";

export default function Copyright(props: BoxProps) {
  return (
    <Box {...props}>
      <Text as="sub">
        {"Copyright © "}
        <Link href="https://github.com/rstar2/" target="_blank">
          Rumen Neshev
        </Link>
        {" " + THIS_YEAR}
      </Text>
    </Box>
  );
}
