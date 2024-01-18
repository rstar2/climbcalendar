import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";

// the tanstack-query cache provider
import { CacheProvider } from "./cache";
// the tanstack-router provider
import { RouterProvider } from "./routes";

import theme from "./theme";

import "./main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CacheProvider>
      <ChakraProvider resetCSS theme={theme}>
        <RouterProvider />
      </ChakraProvider>
    </CacheProvider>
  </React.StrictMode>
);
