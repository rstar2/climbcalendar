import React, { PropsWithChildren } from "react";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { createStandaloneToast } from "@chakra-ui/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { FirebaseError } from "firebase/app";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // default is 0
      staleTime: 3000, // 3 seconds, to "combine" simultaneous same requests from different components, on same "screen"

      // Specifying a longer staleTime means queries will not refetch their data as often
      // Infinity will mean that queries never get stale (always stay fresh),
      // so they are not re-fetched id there's data in the cache for the same key
      //staleTime: Infinity,

      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      networkMode: "always",
    },
    mutations: {
      networkMode: "always",
    },
  },
  queryCache: new QueryCache({
    // onSuccess(data, query) {},
    // onError(error, query) {},

    // one combined callback
    onSettled(_data, error, query) {
      const { meta } = query;

      showNotification(meta as CacheMeta, error);
      // if (queryKey[0] === "admin")

      // show success notification - only for mutations with meta key
      if (meta) showNotification(meta as CacheMeta, error);
    },
  }),

  mutationCache: new MutationCache({
    // onSuccess(data, variables, context, mutation) {},
    // onError(error, variables, context, mutation) {},

    // one combined callback
    onSettled(_data, error, _variables, _context, mutation) {
      const { meta } = mutation;

      // show success notification - only for mutations with meta key
      if (meta) showNotification(meta as CacheMeta, error);
    },
  }),
});

type CacheMeta = { action: string | string[] };

const { toast } = createStandaloneToast();
const showNotification = (meta: CacheMeta, error?: Error | null) => {
  let { action } = meta;
  if (!Array.isArray(action)) action = [action];

  let description;
  if (error) {
    if (error instanceof FirebaseError) {
      const { code } = error;
      switch (code) {
        case "auth/user-not-found":
          description = "Invalid username";
          break;
        case "auth/wrong-password":
          description = "Invalid password";
          break;
      }
    }
    if (!description) description = "Failed action";
  }

  toast({
    title: action.join(" "),
    description,
    status: error ? "error" : "success",
    duration: 3000,
    isClosable: true,
  });
};

/**
 * The cache react-query provider component.
 * Any component that will use any of the cache hooks must be wrapped in such a provider component.
 */
export const CacheProvider: React.FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
