import {
  RouterProvider as RouterProvider_,
  Router,
  Route,
  RootRoute,
  redirect
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import Root from "./Root";
import Home from "./Home";
import Admin from "./Admin";
import { isAuth } from "../cache/auth";

const rootRoute = new RootRoute({
  component: () => (
    <>
      <Root />
      <TanStackRouterDevtools />
    </>
  ),
});

const homeRoute = new Route({
  path: "/",
  getParentRoute: () => rootRoute,
  component: Home,
});

const adminRoute = new Route({
  path: "/admin",
  getParentRoute: () => rootRoute,
  beforeLoad: async () => {
    if (!isAuth()) {
      throw redirect({to: "/"});
    }
  },
  component: Admin,
});

const routeTree = rootRoute.addChildren([homeRoute, adminRoute]);
const router = new Router({ routeTree });

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
