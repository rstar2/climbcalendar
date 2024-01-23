import { Link, LinkProps } from "@tanstack/react-router";
import {
  useDisclosure,
  HStack,
  VStack,
  Button,
  Link as ChakraLink,
  Text,
  Divider,
  useTheme,
  useColorMode,
  IconButton,
  Spacer,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Show,
  Stack,
  Heading,
  DrawerFooter,
  Box,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon, HamburgerIcon } from "@chakra-ui/icons";

import {
  useAuthUser,
  useAuthLoginWithGoogle,
  useAuthLogout,
} from "../cache/auth";

import { GoogleIcon } from "./ProviderIcons";
import Copyright from "./Copyright";

export default function Header() {
  // get the default/global background and set it as solid color to the header,
  // because it's sticky and when scroll-down it seems "transparent",
  // this is "normal" (expected) because only the body has set this background-color and all other
  // divs/elements inherit it implicitly
  const theme = useTheme();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <VStack
      mb={2}
      position="sticky"
      top={0}
      //   make it above some FullCalendar elements so more than 2,
      zIndex={3}
      bg={theme.styles.global.body.bg}
    >
      <HStack w="100%" mt={2} gap="2">
        <Show below="sm">
          <DrawerLogin />
        </Show>

        <Heading size={["md", "xl"]}>Climbing Calendar</Heading>

        <Show above="sm">
          {/* vertical Divider must have height */}
          <Divider orientation="vertical" h={10} />
          <Box flexGrow={1}>
            <NavLinks />
          </Box>
        </Show>
        <Show below="sm">
          <Spacer />
        </Show>

        {/* <GoogleLogin /> */}
        {/* or */}
        {/* <GoogleApiAuth /> */}

        <IconButton
          onClick={() => toggleColorMode()}
          icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
          aria-label="Toggle dark mode"
        ></IconButton>
      </HStack>
      <Divider />
    </VStack>
  );
}

function HeaderLink({
  linkProps,
  label,
}: {
  linkProps: LinkProps;
  label: string;
}) {
  return (
    <ChakraLink as="div">
      <Link {...linkProps}>
        {({ isActive }) => (isActive ? <Text as="b">{label}</Text> : label)}
      </Link>
    </ChakraLink>
  );
}

function DrawerLogin() {
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
            <NavLinks onCloseDrawer={onClose} />
          </DrawerBody>

          <DrawerFooter justifyContent="center">
            <Copyright display={["block", "none"]} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

type NavLinksProps = {
  onCloseDrawer?: () => void;
};
function NavLinks({ onCloseDrawer }: NavLinksProps) {
  // ------------------ Firebase auth ------------------

  const authUser = useAuthUser();
  const loginWithGoogle = useAuthLoginWithGoogle();
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
      {/* show "Admin" only for admins, but then makes sense to show also "Home" only for admins as
        there's no point if its the only route possible*/}
      {!!authUser.user && (
        <>
          {/* close the Drawer on navigation/click */}
          <HeaderLink
            linkProps={{ to: "/", onClick: onCloseDrawer }}
            label="Home"
          />
          <HeaderLink
            linkProps={{ to: "/add", onClick: onCloseDrawer }}
            label="Add"
          />
        </>
      )}

      <Spacer />

      {authUser.isKnown &&
        (!authUser.user ? (
          <Button leftIcon={<GoogleIcon />} onClick={() => loginWithGoogle()}>
            Admin Login
          </Button>
        ) : (
          <Button onClick={() => logout()}>Logout</Button>
        ))}
    </Stack>
  );
}
