import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { type QuerySnapshot } from "firebase/firestore";

import type { Competition } from "../types";
import firebase, { parseDocs } from "../firebase";
import { queryClient } from "./index";
import { useAuthUser } from "./auth";

const collection = firebase.collection(
  import.meta.env.VITE_FIREBASE_COLL_COMPETITIONS!
);

firebase.onSnapshot(collection, (snapshot: QuerySnapshot) => {
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
      console.log(`Query competitions, ${authUser}`);
      
      // the DB is not read-protected only for auth users, so don't "hide" the competitions
      // if (!authUser.user) return null;

      const snapshot = await firebase.getDocs(collection);
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
  }, [authUser.user, refetch]);  // refetch is stable, but to make ESLINT happy

  return data;
}
