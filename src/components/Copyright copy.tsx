import { useState } from "react";
import { Box, Link, Text, type BoxProps } from "@chakra-ui/react";
import { useDebounce, useWindowSize } from "react-use";

import { THIS_YEAR } from "../utils/date";

const HAS_SCROLL_PROPS = { py: 4 };
const NO_SCROLL_PROPS = {
  position: "fixed",
  bottom: 0,
  left: "50%",
  transform: "translateX(-50%)",
  py: 4,
};

function isScrollbarVisible() {
  // Check if the body has a scrollbar
  const bodyHasScrollbar = document.body.scrollHeight > window.innerHeight;

  // Check if the documentElement (html) has a scrollbar
  const htmlHasScrollbar = document.documentElement.scrollHeight > window.innerHeight;

  // Return true if either the body or html has a scrollbar
  return bodyHasScrollbar || htmlHasScrollbar;
}
export default function Copyright(props: BoxProps) {
  const [hasScroll, setHasScroll] = useState(false);
  const { width, height } = useWindowSize();

  useDebounce(
    () => {
      //   console.log("???", width, height);
      const hasScrollbar = isScrollbarVisible();
      setHasScroll(hasScrollbar);
      //   if (hasScrollbar) {
      //     console.log("Scrollbar is visible.");
      //   } else {
      //     console.log("Scrollbar is not visible.");
      //   }
    },
    300,
    [width, height]
  );

  return (
    <Box textAlign="center" {...(hasScroll ? HAS_SCROLL_PROPS : NO_SCROLL_PROPS)} {...props}>
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
