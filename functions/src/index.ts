/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
// Firebase Authentication triggers is v1, but that doesn't matter, v1 and v2 functions cn coexist
import { user } from "firebase-functions/v1/auth";
import { onCall, onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// NOTE: Must be called always before using any of the Firebase services (like Auth, Firestore)
initializeApp();

/**
 * Add custom claims (role ADMIN) to some specific users
 * https://firebase.google.com/docs/auth/admin/custom-claims
 */
export const authUserCreated = user().onCreate(async (user) => {
  logger.log(
    `AuthUser created: ${user.email} (${user.uid}), verified: ${user.emailVerified}`
  );

  const admins = (
    await getFirestore().collection("admins").listDocuments()
  ).map((docRef) => docRef.id);

  // add ADMIN role to some special accounts
  if (user.emailVerified && user.email && admins.includes(user.email)) {
    const customClaims = {
      role: "admin",
    };
    await getAuth().setCustomUserClaims(user.uid, customClaims);
    logger.log(`Set ADMIN role to: ${user.uid}`);
  }
});

/**
 * Can be called directly only from another Firebase client app
 */
export const makeAdmins = onCall(async (request) => {
  return await makeAdminsImpl();
});

/**
 * It can be called/tested directly with HTTP on
 * https://us-central1-climbcalendar-13b0d.cloudfunctions.net/makeAdminsHttp
 */
export const makeAdminsHttp = onRequest({ cors: true }, async (req, res) => {
  res.status(200).json(await makeAdminsImpl());
});

async function makeAdminsImpl() {
  const admins = (
    await getFirestore().collection("admins").listDocuments()
  ).map((docRef) => docRef.id);

  logger.log(`admins: ${admins.join()}`);

  const customClaimsAdmin = {
    role: "admin",
  };
  let newAdmins = 0;
  // find all possible admins and add them the ADMIN claim
  for (const admin of admins) {
    try {
      const user = await getAuth().getUserByEmail(admin);

      // if user doesn't have this claim then add it
      const customClaims = user.customClaims ?? {};
      if (customClaims.role !== "admin") {
        await getAuth().setCustomUserClaims(user.uid, {...customClaims, ...customClaimsAdmin});
        logger.log(`Set ADMIN role to: ${user.uid}`);
        newAdmins++;
      }
    } catch {
      // if there's no such user for such "admin"
      continue;
    }
  }

  return { newAdmins };
}
