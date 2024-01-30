import { CompetitionNew } from "../types";
import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type QuerySnapshot } from "firebase/firestore";

import type { Competition } from "../types";
import firebase, { parseDocs } from "../firebase";
import { queryClient } from "./index";
import { useAuthUser, isAuthAdmin } from "./auth";

const competitionsCol = firebase.collection(import.meta.env.VITE_FIREBASE_COLL_COMPETITIONS!);

firebase.onSnapshot(competitionsCol, (snapshot: QuerySnapshot) => {
  const competitions = parseDocs(snapshot) as Competition[];
  queryClient.setQueryData(["competitions"], competitions);
});

/**
 * Query for the Competitions state.
 */
export function useCompetitions() {
  const authUser = useAuthUser();

  const { data, refetch } = useQuery({
    queryKey: ["competitions"],
    queryFn: async () => {
      // the DB is not read-protected for not-auth users, so don't "hide" the competitions
      // if (!authUser.user) return null;

      const snapshot = await firebase.getDocs(competitionsCol);
      const competitions = parseDocs(snapshot) as Competition[];
      return competitions;
    },
    enabled: false,
    staleTime: Infinity,
    // set it so that the TS to auto-infer the useCompetitions().data type
    initialData: undefined as Competition[] | undefined,
  });

  // on change of auth state refetch the competitions again
  useEffect(() => {
    refetch();
  }, [authUser.user, refetch]); // refetch is stable, but to make ESLINT happy

  return data;
}

/**
 * Mutation for "incrementing" an Activity.
 */
export function useCompetitionAdd() {
  const mutation = useMutation({
    mutationFn: async (competitionNew: CompetitionNew) => {
      const isAdmin = await isAuthAdmin();
      if (!isAdmin) throw new Error("Sorry, only admin can add competitions");
      return firebase.addDoc(competitionsCol, competitionNew);
    },
    // meta is used for success/failed notification on mutation result
    meta: {
      action: ["Competition", "Add"],
    },
  });

  // if needed can return the whole mutation, like loading, and error state
  return mutation.mutateAsync;
}

/**
 * Mutation for "deleting" a Competition.
 */
export function useCompetitionDelete() {
  const mutation = useMutation({
    mutationFn: async (competitionId: string) => {
      const isAdmin = await isAuthAdmin();
      if (!isAdmin) throw new Error("Sorry, only admin can delete competitions");
      return firebase.deleteDoc(competitionsCol, competitionId);
    },
    // meta is used for success/failed notification on mutation result
    meta: {
      action: ["Competition", "Delete"],
    },
  });

  // if needed can return the whole mutation, like loading, and error state
  return mutation.mutateAsync;
}

/**
 * Mutation for "editing" a Competition.
 */
export function useCompetitionEdit() {
  const mutation = useMutation({
    mutationFn: async ({ id: competitionId, competition }: { id: string; competition: CompetitionNew }) => {
      const isAdmin = await isAuthAdmin();
      if (!isAdmin) throw new Error("Sorry, only admin can delete competitions");

      return firebase.updateDoc(competitionsCol, competitionId, competition);
    },
    // meta is used for success/failed notification on mutation result
    meta: {
      action: ["Competition", "Edit"],
    },
  });

  // if needed can return the whole mutation, like loading, and error state
  return mutation.mutateAsync;
}
