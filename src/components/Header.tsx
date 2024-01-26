import {
  Box,
  BoxProps,
  Button,
  Link as ChakraLink,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Heading,
  IconButton,
  Show,
  Spacer,
  Stack,
  Text,
  VStack,
  useColorMode,
  useDisclosure,
  Icon,
} from "@chakra-ui/react";
import { HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { PiPrinterThin } from "react-icons/pi";
import { Link, LinkProps } from "@tanstack/react-router";

import { THIS_YEAR } from "../utils/date";
import { useAuthAdmin, useAuthLoginWithPopup, useAuthLogout, useAuthUser } from "../cache/auth";

import Copyright from "./Copyright";
import { FacebookIcon, GoogleIcon } from "./ProviderIcons";
import { printElement } from "../utils/print";

export default function Header(props: BoxProps) {
  const { colorMode, toggleColorMode } = useColorMode();

  // get the default/global background and set it as solid color to the header,
  // because it's sticky and when scroll-down it seems "transparent",
  // this is "normal" (expected) because only the body has set this background-color and all other
  // divs/elements inherit it implicitly
  //   const theme = useTheme();

  return (
    <VStack
      {...props}

      //   position="sticky"
      //   top={0}
      //   //   make it above some FullCalendar elements so more than 2,
      //   zIndex={3}
      //   bg={theme.styles.global.body.bg}
    >
      <HStack width="full" mt={2} gap="2">
        <Show below="sm">
          <HeaderDrawer />
        </Show>

        <Heading size={["md", "xl"]}>Competition Calendar {THIS_YEAR}</Heading>

        <Show above="sm">
          {/* vertical Divider must have height */}
          <Divider orientation="vertical" h={10} />
          <Box flexGrow={1}>
            <HeaderLinks />
          </Box>
        </Show>
        <Show below="sm">
          <Spacer />
        </Show>

        {/* <GoogleLogin /> */}
        {/* or */}
        {/* <GoogleApiAuth /> */}

        <IconButton
          size={["sm", "md"]}
          onClick={() => toggleColorMode()}
          icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
          aria-label="Toggle dark mode"
        ></IconButton>
        <IconButton
          size={["sm", "md"]}
          onClick={() => {
            const elPrintable = document.querySelector(".printable") as HTMLElement;
            if (!elPrintable) return;
            printElement("Climbing Calendar", elPrintable);
          }}
          icon={<Icon as={PiPrinterThin} />}
          aria-label="Toggle dark mode"
        ></IconButton>
      </HStack>
      <Divider />
    </VStack>
  );
}

function HeaderLink({ linkProps, label }: { linkProps: LinkProps; label: string }) {
  return (
    <ChakraLink as="div">
      <Link {...linkProps}>{({ isActive }) => (isActive ? <Text as="b">{label}</Text> : label)}</Link>
    </ChakraLink>
  );
}

function HeaderDrawer() {
  const { isOpen, onClose, onToggle } = useDisclosure();

  return (
    <>
      <HamburgerIcon onClick={onToggle} />
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>

          <DrawerBody>
            <HeaderLinks onCloseDrawer={onClose} />
          </DrawerBody>

          <DrawerFooter justifyContent="center">
            <Copyright display={["block", "none"]} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

type HeaderLinksProps = {
  onCloseDrawer?: () => void;
};
function HeaderLinks({ onCloseDrawer }: HeaderLinksProps) {
  // ------------------ Firebase auth ------------------

  const authUser = useAuthUser();
  const isAdmin = useAuthAdmin();
  const loginWithPopup = useAuthLoginWithPopup();
  const logout = useAuthLogout();

  //   useEffect(() => {
  //     authUser.user
  //       ?.getIdToken()
  //       .then((idToken) =>
  //         console.log("Encoded Firebase JWT ID token: " + idToken)
  //       );
  //   }, [authUser]);

  return (
    <Stack direction={["column", "row"]} alignItems={["center", "end"]}>
      {/* show "Add" only for admins, but then makes sense to show also "Home" only for admins as
        there's no point if its the only route possible*/}
      {isAdmin && (
        <>
          {/* close the Drawer on navigation/click */}
          <HeaderLink linkProps={{ to: "/", onClick: onCloseDrawer }} label="Home" />
          <HeaderLink linkProps={{ to: "/add", onClick: onCloseDrawer }} label="Add" />
        </>
      )}

      <Spacer />

      {authUser.isKnown &&
        (!authUser.user ? (
          <>
            <Button leftIcon={<GoogleIcon />} onClick={() => loginWithPopup("google")}>
              Login With Google
            </Button>
            <Button leftIcon={<FacebookIcon />} onClick={() => loginWithPopup("facebook")}>
              Login With Facebook
            </Button>
          </>
        ) : (
          <Button onClick={() => logout()}>Logout</Button>
        ))}
    </Stack>
  );
}
