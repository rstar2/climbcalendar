import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";

// the tanstack-query cache provider
import { CacheProvider } from "./cache";
// the tanstack-router provider
import { RouterProvider } from "./routes";

import theme from "./theme";

import "./main.css";

import "./registerSW.ts";

import "./i18n.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CacheProvider>
      <ChakraProvider resetCSS theme={theme}>
        <RouterProvider />
      </ChakraProvider>
    </CacheProvider>
  </React.StrictMode>
);

// prevent the browser's Ctrl-P that opens the print dialog,
// note that the Print s still accessible form the browser's context menu
window.addEventListener("keydown", function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key == "p") {
    alert("Please use the Print button for printing just the competitions view");
    e.preventDefault();
    e.stopImmediatePropagation();
  }
});
