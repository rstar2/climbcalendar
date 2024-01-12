import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";

import theme from "./theme";

// the tanstack-query cache provider
import { CacheProvider } from "./cache";

import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CacheProvider>
      <ChakraProvider resetCSS theme={theme}>
        <App />
      </ChakraProvider>
    </CacheProvider>
  </React.StrictMode>
);
