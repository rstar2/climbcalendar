import { useEffect } from "react";
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
} from "@chakra-ui/react";
import { SunIcon, MoonIcon, HamburgerIcon } from "@chakra-ui/icons";

import {
  useAuthUser,
  useAuthLoginWithGoogle,
  useAuthLogout,
  //   setGoogleCredential,
} from "../cache/auth";

import { GoogleIcon } from "./ProviderIcons";

export default function Header() {
  const authUser = useAuthUser();

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
      zIndex={2}
      bg={theme.styles.global.body.bg}
    >
      <HStack w="100%" mt={2} gap="2">
        <Show below="sm">
          <DrawerLogin />
        </Show>

        <HeaderLink linkProps={{ to: "/" }} label="Home" />
        {!!authUser.user && (
          <HeaderLink linkProps={{ to: "/admin" }} label="Admin" />
        )}

        <Spacer />

        <Show above="sm">
          <LoginLinks />
        </Show>

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
          <DrawerHeader borderBottomWidth="1px">Login</DrawerHeader>

          <DrawerBody>
            <LoginLinks />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function LoginLinks() {
  //   // ------------------ Google Login ------------------
  //   // https://developers.google.com/identity/gsi/web/reference/js-reference
  //   useEffect(() => {
  //     google.accounts.id.initialize({
  //       client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  //       callback: onGoogleLogin,
  //     });

  //     // show a GoogleLogin button
  //     google.accounts.id.renderButton(
  //       document.getElementById("g-signin-button")!,
  //       { theme: "outline", size: "large", type: "standard" } // customization attributes
  //     );

  //     // show the auto-login prompt (the popup on the top-left corner)
  //     google.accounts.id.prompt((notification) => {
  //       if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
  //         // try next provider if OneTap is not displayed or skipped
  //         //console.log("Google OneTap is skipped");
  //       }
  //     }); // also display the One Tap dialog
  //   }, []);

  //   function onGoogleLogin(response: google.accounts.id.CredentialResponse) {
  //     console.log("Encoded Google JWT ID token: " + response.credential);
  //     setGoogleCredential(response.credential);
  //   }

  //   function googleLogout() {
  //     google.accounts.id.disableAutoSelect();
  //   }
  //  // ------------------ END Google Login ------------------

  // ------------------ Firebase auth ------------------

  const authUser = useAuthUser();
  const loginWithGoogle = useAuthLoginWithGoogle();
  const logout = useAuthLogout();

  useEffect(() => {
    authUser.user
      ?.getIdToken()
      .then((idToken) =>
        console.log("Encoded Firebase JWT ID token: " + idToken)
      );
  }, [authUser]);

  function handleLoginWithGoogle() {
    alert("Login with Google");
  }

  // ------------------ END Firebase auth ------------------

  return (
    <Stack direction={["column", "row"]}>
      {/* the GoogleLogin button will be rendered here by GIS */}
      {/* <Box id="g-signin-button" display="inline-block" /> */}

      <Button leftIcon={<GoogleIcon />} onClick={handleLoginWithGoogle}>
        Login with Google
      </Button>

      {authUser.isKnown &&
        (!authUser.user ? (
          <Button onClick={() => loginWithGoogle()}>Login</Button>
        ) : (
          <Button onClick={() => logout()}>Logout</Button>
        ))}
    </Stack>
  );
}
