import { useQuery, useMutation } from "@tanstack/react-query";

import firebase from "../firebase";
import { queryClient } from "./index";
import { User } from "firebase/auth";

firebase.onAuthStateChanged((user) => {
  queryClient.setQueryData(["authUser"], {
    isKnown: true,
    authUser: user,
  });
});

type AuthUser = {
  isKnown: boolean;
  authUser?: User;
};

/**
 * Query for the auth state.
 */
export function useAuthUser() {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: () => Promise.reject(new Error("Not used")),
    enabled: false,
    staleTime: Infinity,
    initialData: {
      isKnown: false,
      authUser: undefined,
    } as AuthUser,
  });
}

/**
 * Mutation to login with Google.
 * Could use directly the firebase.signInWithGoogle(), but thus all is wrapped in one place,
 * and can reuse the mutations API
 */
export function useAuthLoginWithGoogle() {
  const mutation = useMutation({
    mutationFn: async () => firebase.signInWithGoogle(),
    // meta is used for success/failed notification on mutation result
    meta: {
      action: "Login",
    },
  });

  // if needed can return the whole mutation, like loading, and error state
  return mutation.mutateAsync;
}

/**
 * Mutation to logout.
 * Could use directly the firebase.signOut(), but thus all is wrapped hin one place,
 * and can reuse the mutations API
 */
export function useAuthLogout() {
  const mutation = useMutation({
    mutationFn: async () => firebase.signOut(),
    // meta is used for success/failed notification on mutation result
    meta: {
      action: "Logout",
    },
  });

  // if needed can return the whole mutation, like loading, and error state
  return mutation.mutateAsync;
}

/**
 * Set the Google credentials to be reused by Firebase
 * Just re-export 'firebase.setGoogleCredential()'
 */
export function setGoogleCredential(idToken: string) {
  firebase.setGoogleCredential(idToken);
}
