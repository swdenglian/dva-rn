import React from "react";
import { IRouterConfigs } from "./dva-types";
import { Router, Route, RouteProps } from "react-router";
import { History } from "history";
import { Provider } from "react-redux";
import { Store } from "redux";

export default function createWebRouter(
  routerConfigs: IRouterConfigs,
  history: History,
  store: Store
) {
  const children = getRoute(routerConfigs);
  console.log(children);
  const createWebAppRouter = () => (
    <Provider store={store}>
      <Router history={history}>{children}</Router>
    </Provider>
  );

  return createWebAppRouter;
}

function getRoute(routerConfigs: IRouterConfigs) {
  const { path = "", component, routes = [] } = routerConfigs;
  const routeProps: RouteProps = {
    path
  };

  const children: React.ReactElement[] = [];
  if (component) routeProps.component = component;
  if (routes.length) {
    routes.forEach(route => {
      children.push(getRoute(route));
    });
  }

  return (
    <Route key={routerConfigs.path} {...routeProps}>
      {children}
    </Route>
  );
}
