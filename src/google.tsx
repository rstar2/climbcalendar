import { useCallback, useState } from "react";
import { useEffectOnce } from "react-use";
import { Button } from "@chakra-ui/react";

import firebase from "./firebase";

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/calendar";

// Discovery doc URLs for APIs used by the GAPI - these apis will be loaded by GAPI

// they are different for each Google API,
// 1. Some may have specific one like the People API - it's in its documentation
// 2. If the documentation don't specify one the use the form
//   https://www.googleapis.com/discovery/v1/apis/<name>/version/rest
// 3. If invalid discovery are set they the library will not initialize at all
// 4. Any loaded API must also be enabled for the concrete project, look at the error if there's such
const DISCOVERY_DOCS = [
  // Google Calendar API is enabled for this project
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];

export function GoogleApiAuth() {
  // Google OAuth Authorization (this include login also)

  const [isGoogleAPILoaded, setGoogleAPILoaded] = useState(false);
  const [googleAuthToken, setGoogleAuthToken] = useState<google.accounts.oauth2.TokenResponse>();

  // load the Google APIs only once in the beginning
  useEffectOnce(() => {
    (async () => {
      await loadGoogleAPI();

      // show the GAuth button
      setGoogleAPILoaded(true);
    })();
  });

  const onGoogleAuth = useCallback(async () => {
    // get a new token
    const token = await authGoogleAPI();

    // update UI - e.g remove the button
    setGoogleAuthToken(token);

    // also authorize into Firebase
    firebase.setGoogleCredential(undefined, token.access_token);
  }, []);

  //Sign out the user upon button click.

  const onList = useCallback(() => {
    listUpcomingEvents();
  }, []);

  return !googleAuthToken ? (
    <Button isLoading={!isGoogleAPILoaded} loadingText="Checking..." onClick={onGoogleAuth}>
      GAuth
    </Button>
  ) : (
    <Button onClick={onList}>Load</Button>
  );
}

export function GoogleLogin() {
  // https://developers.google.com/identity/gsi/web/reference/js-reference
  useEffectOnce(() => {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (response: google.accounts.id.CredentialResponse) => {
        console.log("Encoded Google JWT ID token: " + response.credential);
        firebase.setGoogleCredential(response.credential);
      },
    });

    // show a GoogleLogin button
    google.accounts.id.renderButton(
      document.getElementById("g-signin-button")!,
      { theme: "outline", size: "large", type: "standard" } // customization attributes
    );

    // show the auto-login prompt, e.g the One Tap dialog (the popup on the top-left corner)
    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // try next provider if OneTap is not displayed or skipped
        //console.log("Google OneTap is skipped");
      }
    });
  });

  //   function googleLogout() {
  //     google.accounts.id.disableAutoSelect();
  //   }

  // the GoogleLogin button will be rendered here by GIS
  return <Button id="g-signin-button" display="inline-block" />;
}

async function loadGoogleAPI() {
  return new Promise<void>((resolve) => {
    gapi.load(
      "client",
      /**
       * Callback after the API client is loaded. Loads the
       * discovery doc to initialize the API.
       */ async function initializeGapiClient() {
        await gapi.client.init({
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY!,
          discoveryDocs: DISCOVERY_DOCS,
        });
        resolve();
      }
    );
  });
}

async function authGoogleAPI() {
  return new Promise<google.accounts.oauth2.TokenResponse>((resolve, reject) => {
    // NOTE! the gapi.auth.authorize() is deprecated and not allowed for new apps, so this is the new way (GIS)
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: SCOPES,
      //   login_hint: "rumenn@qnext.com",
      callback: async (token) => {
        if (token.error !== undefined) return reject(new Error(token.error));

        // the token is auto set in gapi.client.setToken(token);

        const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${token.access_token}` },
        }).then((res) => res.json());
        console.log(`User info ${JSON.stringify(userInfo)}`);

        // TODO: store the token and the userInfo in localStorage, so next time when opened
        // the same app/page is opened to be able to check if user is still authorized
        // could try to access some api and if fail to show the "Authorize" button again,
        // and if succeeded to be assume all is OK.

        resolve(token);
      },
    });

    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: "" });
  });
}

// function revokeAuthGoogleAPI() {
//   const token = gapi.client.getToken();
//   if (token !== null) {
//     google.accounts.oauth2.revoke(token.access_token, () => {});
//     gapi.client.setToken(null);
//     localStorage.clear();
//   }
// }

/**
 * // TODO:  just a demo usage of the Calendar  API
 * https://blockchain.oodles.io/dev-blog/integrating-google-calendar-api-into-react-application/
 *
 *
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
async function listUpcomingEvents() {
  let response;
  try {
    const request = {
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: "startTime",
    };
    response = await gapi.client.calendar.events.list(request);
  } catch (err) {
    console.error((err as Error).message);
    return;
  }

  const events = response.result.items;
  if (!events || events.length == 0) {
    console.log("No events found.");
    return;
  }
  // Flatten to string to display
  const output = events.reduce(
    (str, event) => `${str}${event.summary} (${event.start?.dateTime || event.start?.date})\n`,
    "Events:\n"
  );
  console.log(output);
}
