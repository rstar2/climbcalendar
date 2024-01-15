import { useEffect } from "react";
import { Link, LinkProps } from "@tanstack/react-router";
import {
  HStack,
  VStack,
  Button,
  Link as ChakraLink,
  Text,
  Divider,
  useTheme,
} from "@chakra-ui/react";

import {
  useAuthUser,
  useAuthLoginWithGoogle,
  useAuthLogout,
  //   setGoogleCredential,
} from "../cache/auth";

import { GoogleIcon } from "./ProviderIcons";
import Expander from "./Expander";

export default function Header() {
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

  // get the default/global background and set it as solid color to the header,
  // because it's sticky and when scroll-down it seems "transparent",
  // this is "normal" (expected) because only the body has set this background-color and all other
  // divs/elements inherit it implicitly 
  const theme = useTheme();
  return (
    <VStack mb={2} position="sticky" top={0} zIndex={2} bg={theme.styles.global.body.bg}>
      <HStack w="100%" mt={2}>
        <HeaderLink linkProps={{ to: "/" }} label="Home" />
        {!!authUser.user && (
          <HeaderLink linkProps={{ to: "/admin" }} label="Admin" />
        )}

        <Expander />
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
