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
  const {
    data: { authUser },
  } = useAuthUser();

  const { data, refetch } = useQuery({
    queryKey: ["competitions"],
    queryFn: async () => {
      console.log(`Query competitions, ${authUser}`);
      if (!authUser) return null;

      const snapshot = await firebase.getDocs(collection);
      const competitions = parseDocs(snapshot) as Competition[];
      return competitions;
    },
    enabled: false,
    staleTime: Infinity,
    // set it so that the TS to auto-infer the useCompetitions().data type
    initialData: undefined as Competition[] | undefined,
  });

  // on change of auth state get the competitions
  useEffect(() => {
    refetch();
  }, [authUser]);

  return data;
}
