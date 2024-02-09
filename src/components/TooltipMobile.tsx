import React from "react";

import { Tooltip } from "@chakra-ui/react";
import useMobileDetect from "../hooks/useMobile";

type TooltipMobileProps = React.PropsWithChildren & {
  label: string;
};
export default function TooltipMobile({ label, children }: TooltipMobileProps) {
  const { isMobile, supportTouch } = useMobileDetect();

  // on  mobiles just don't add tooltips
  return isMobile && supportTouch ? children : <Tooltip label={label}>{children}</Tooltip>;
}
