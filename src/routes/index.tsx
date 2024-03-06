import React from "react";
import { RouterProvider as RouterProvider_, Router, Route, RootRoute, redirect } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useTranslation } from "react-i18next";
import Root from "./Root";
import Home from "./Home";
import Add from "./Add";
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
  component: Add,
});

const routeTree = rootRoute.addChildren([homeRoute, adminRoute]);
const router = new Router({
  routeTree,
  // this is actually the React.Suspense.fallback component
  defaultPendingComponent: DefaultPendingComponent,
});

function DefaultPendingComponent() {
  // NOTE: do not trigger Suspense from this component
  const { t, i18n } = useTranslation(undefined, { useSuspense: false });
  // it will show the default "..." and when translation is loaded it will shown the localized string,
  // but just for a "sec" (when the translation is loaded and "t" is "updated" by the hook and so component rerenders,
  // but after that the this DefaultPendingComponent si just replaced by the router)
  // so the only solution is to cache this "loading" key per language and
  // then next time to show the real localized value.
  // Still on the very first time it's impossible and must fallback to the "..." default.
  const loading = i18n.exists("loading") ? t("loading") : "...";
  return <div> {loading} </div>;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

/**
 * The router provider component.
 */
export const RouterProvider: React.FC = () => <RouterProvider_ router={router}></RouterProvider_>;
