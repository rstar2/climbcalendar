import { useEffect, useRef } from "react";
import { useMount, useUnmount } from "react-use";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { QuerySnapshot, Unsubscribe } from "firebase/firestore";

import type { UserEvent, UserEventNew } from "../types";
import firebase, { parseDocs } from "../firebase";
import { useAuthUser } from "./auth";
import { queryClient } from "./index";
import { prune } from "../utils";

let unsubscribeOnSnapshot: Unsubscribe | undefined;

let snapshotHooks = 0;
function updateHooksCount(added: boolean, email?: string) {
  if (added) snapshotHooks++;
  else {
    if (snapshotHooks > 0) snapshotHooks--;
    else console.error("Invalid snapshot hooks count", snapshotHooks);
  }

  //   console.log("??? snapshot hooks", snapshotHooks);
  if (snapshotHooks === 1) {
    // console.log("??? snapshot subscribe");
    const userEventsCol = firebase.collection(`${import.meta.env.VITE_FIREBASE_COLL_USEREVENTS!}/${email}/events`);

    unsubscribeOnSnapshot = firebase.onSnapshot(userEventsCol, (snapshot: QuerySnapshot) => {
      //   console.log("??? snapshot data", snapshot.docs.length);

      const userEvents = parseDocs(snapshot) as UserEvent[];
      queryClient.setQueryData(["userEvents"], userEvents);
    });
  } else if (snapshotHooks === 0) {
    // console.log("??? snapshot unsubscribe");
    unsubscribeOnSnapshot?.();
  }
}

/**
 * Query for the UserEvents state.
 */
export function useUserEvents() {
  const isAdded = useRef(false);
  const authUser = useAuthUser();

  const { data } = useQuery({
    queryKey: ["userEvents"],
    queryFn: () => null,
    enabled: false,
    staleTime: Infinity,
    // set it so that the TS to auto-infer the useCompetitions().data type
    initialData: undefined as UserEvent[] | undefined,
  });

  useMount(() => {
    // console.log("??? mount", !!authUser.user, isAdded.current);
    if (authUser.user && !isAdded.current) {
      isAdded.current = true;
      updateHooksCount(true, authUser.user.email!);
    }
  });
  useUnmount(() => {
    // console.log("??? unmount", !!authUser.user, isAdded.current);
    if (authUser.user && isAdded.current) {
      updateHooksCount(false);
    }
    // always rest the ref as it turns out they are nit reset on unmount
    isAdded.current = false;
  });

  // on change of auth state refetch the competitions again
  useEffect(() => {
    // console.log("??? auth-change", !!authUser.user, isAdded.current);
    if (authUser.user) {
      if (!isAdded.current) {
        isAdded.current = true;
        updateHooksCount(true, authUser.user.email!);
      }
    } else {
      if (isAdded.current) {
        isAdded.current = false;
        updateHooksCount(false);
      }
    }
  }, [authUser.user]);

  return data;
}

/**
 * Mutation for "adding" a UserEvent.
 */
export function useUserEventAdd() {
  const authUser = useAuthUser();

  const mutation = useMutation({
    mutationFn: async (userEventNew: UserEventNew) => {
      if (!authUser.user) throw new Error("Sorry, not logged in");
      const userEventsCol = firebase.collection(
        `${import.meta.env.VITE_FIREBASE_COLL_USEREVENTS!}/${authUser.user.email!}/events`
      );

      return firebase.addDoc(userEventsCol, prune(userEventNew));
    },
    // meta is used for success/failed notification on mutation result
    meta: {
      action: ["UserEvent", "Add"],
    },
  });

  // if needed can return the whole mutation, like loading, and error state
  return mutation.mutateAsync;
}

/**
 * Mutation for "editing" a UserEvent.
 */
export function useUserEventEdit() {
  const authUser = useAuthUser();

  const mutation = useMutation({
    mutationFn: async (userEvent: UserEvent) => {
      if (!authUser.user) throw new Error("Sorry, not logged in");
      const userEventsCol = firebase.collection(
        `${import.meta.env.VITE_FIREBASE_COLL_USEREVENTS!}/${authUser.user.email!}/events`
      );
      return firebase.updateDoc(userEventsCol, userEvent.id, userEvent);
    },
    // meta is used for success/failed notification on mutation result
    meta: {
      action: ["UserEvent", "Edit"],
    },
  });

  // if needed can return the whole mutation, like loading, and error state
  return mutation.mutateAsync;
}

/**
 * Mutation for "deleting" a UserEvent.
 */
export function useUserEventDelete() {
  const authUser = useAuthUser();

  const mutation = useMutation({
    mutationFn: async (userEventId: string) => {
      if (!authUser.user) throw new Error("Sorry, not logged in");
      const userEventsCol = firebase.collection(
        `${import.meta.env.VITE_FIREBASE_COLL_USEREVENTS!}/${authUser.user.email!}/events`
      );
      return firebase.deleteDoc(userEventsCol, userEventId);
    },
    // meta is used for success/failed notification on mutation result
    meta: {
      action: ["UserEvent", "Delete"],
    },
  });

  // if needed can return the whole mutation, like loading, and error state
  return mutation.mutateAsync;
}
