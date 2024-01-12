/* global google */
import { useEffect } from "react";
import { Container, Box, Button, Divider } from "@chakra-ui/react";

import "./App.css";
import Calendar from "./components/Calendar";
import { useCompetitions } from "./cache/competitions";
import {
  useAuthUser,
  useAuthLoginWithGoogle,
  useAuthLogout,
  setGoogleCredential,
} from "./cache/auth";

function App() {
  // ------------------ Google Login ------------------
  // https://developers.google.com/identity/gsi/web/reference/js-reference
  useEffect(() => {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: onGoogleLogin,
    });

    // show a GoogleLogin button
    google.accounts.id.renderButton(
      document.getElementById("g-signin-button")!,
      { theme: "outline", size: "large", type: "standard" } // customization attributes
    );

    // show the auto-login prompt (the popup on the top-left corner)
    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // try next provider if OneTap is not displayed or skipped
        //console.log("Google OneTap is skipped");
      }
    }); // also display the One Tap dialog
  }, []);

  function onGoogleLogin(response: google.accounts.id.CredentialResponse) {
    console.log("Encoded Google JWT ID token: " + response.credential);
    setGoogleCredential(response.credential);
  }

  function googleLogout() {
    google.accounts.id.disableAutoSelect();
  }
  // ------------------ END Google Login ------------------


  


  // ------------------ Firebase auth ------------------

  const {
    data: { isKnown, authUser },
  } = useAuthUser();
  const loginWithGoogle = useAuthLoginWithGoogle();
  const logout = useAuthLogout();

  const competitions = useCompetitions();

  useEffect(() => {
    authUser
      ?.getIdToken()
      .then((idToken) =>
        console.log("Encoded Firebase JWT ID token: " + idToken)
      );
  }, [authUser]);

  // ------------------ END Firebase auth ------------------

  return (
    <Container maxW="90%">
      <div id="g-signin-button" />
      {isKnown &&
        (!authUser ? (
          <Button onClick={() => loginWithGoogle()}>Login</Button>
        ) : (
          <Button onClick={() => logout()}>Logout</Button>
        ))}

      <Divider my={2} />
      <Box>{JSON.stringify(authUser)}</Box>
      <Divider my={2} />
      <Box>{JSON.stringify(competitions)}</Box>
      <Divider my={2} />
      <Calendar />
    </Container>
  );
}

export default App;
