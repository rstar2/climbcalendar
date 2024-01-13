import { useQuery, useMutation } from "@tanstack/react-query";

import firebase from "../firebase";
import { queryClient } from "./index";
import { User } from "firebase/auth";

firebase.onAuthStateChanged((user) => {
  queryClient.setQueryData<AuthUser>(["authUser"], {
    isKnown: true,
    user: user ?? undefined,
  });
});

type AuthUser = {
  isKnown: boolean;
  user?: User;
};

/**
 * Return if there's authorized user
 */
export function isAuth() {
  return !!queryClient.getQueryData<AuthUser>(["authUser"])?.user;
}

export async function isAdmin(): Promise<boolean> {
  const user = queryClient.getQueryData<AuthUser>(["authUser"])?.user;

  // "role" is a custom claim
  return (
    !!user &&
    user
      .getIdTokenResult()
      .then((idTokenResult) => idTokenResult.claims.role === "admin")
  );
}

/**
 * Query for the auth state.
 */
export function useAuthUser() {
  const { data } = useQuery({
    queryKey: ["authUser"],
    queryFn: () => Promise.reject(new Error("Not used")),
    enabled: false,
    staleTime: Infinity,
    initialData: {
      isKnown: false,
      user: undefined,
    } as AuthUser,
  });
  return data;
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
