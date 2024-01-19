import React from "react";
import {
  RouterProvider as RouterProvider_,
  Router,
  Route,
  RootRoute,
  redirect,
} from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import Root from "./Root";
import Home from "./Home";
import CompetitionAdd from "./CompetitionAdd";
import { isAuth } from "../cache/auth";

// Vite (and Webpack) process the "process.env.NODE_ENV"
// by actually replacing it completely with value of the real NODE_ENV env-variable,
// which is otherwise only accessible in NodeJS (server) world

// This is the recommended way to load the "@tanstack/router-devtools" only in production,
// Note this is much better in contrast to "react-query" where its "@tanstack/react-query-devtools"
// are loaded always just in production are not used/shown in the UI
const TanStackRouterDevtools = 
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      );

const rootRoute = new RootRoute({
  component: () => (
    <>
      <Root />
      <TanStackRouterDevtools />
    </>
  ),
  // if needed to overwrite the Router.defaultPendingComponent component
  //   pendingComponent: () => <div>Loading...</div>,
});

const homeRoute = new Route({
  path: "/",
  getParentRoute: () => rootRoute,
  component: Home,
});

const adminRoute = new Route({
  path: "/add",
  getParentRoute: () => rootRoute,
  beforeLoad: async () => {
    if (!isAuth()) {
      throw redirect({ to: "/" });
    }
  },
  component: CompetitionAdd,
});

const routeTree = rootRoute.addChildren([homeRoute, adminRoute]);
const router = new Router({
  routeTree,
  defaultPendingComponent: () => <div>Loading...</div>,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

/**
 * The router provider component.
 */
export const RouterProvider: React.FC = () => (
  <RouterProvider_ router={router}></RouterProvider_>
);
