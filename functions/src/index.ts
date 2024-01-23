/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { getAuth } from "firebase-admin/auth";
import { user } from "firebase-functions/v1/auth";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// NOTE: Must be called always before using any of the Firebase services (like auth)
initializeApp();

const ADMINS = new Set<string>([
  "neshev.rumen@gmail.com",
  "rumenn@qnext.com",
  "kaempilka@gmail.com",
]);

/**
 * Add custom claims (role ADMIN) to some specific users
 * https://firebase.google.com/docs/auth/admin/custom-claims
 */
export const authUserCreated = user().onCreate(async (user) => {
  logger.log(
    `AuthUser created: ${user.email} (${user.uid}), verified: ${user.emailVerified}`
  );

  // add ADMIN role to some special accounts
  if (user.emailVerified && user.email && ADMINS.has(user.email)) {
    const customClaims = {
      role: "admin",
    };
    await getAuth().setCustomUserClaims(user.uid, customClaims);
    logger.log(`Set ADMIN role to: ${user.uid}`);
  }
});
