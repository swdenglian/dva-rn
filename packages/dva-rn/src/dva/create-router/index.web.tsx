console.log("dva-web");
import React from "react";
import { IRouterConfigs, IDvaConfigs, IDvaInstance } from "../dva-types";
import { Router, Route, RouteProps, Redirect, Switch } from "react-router";
import { createBrowserHistory, createHashHistory } from "history";

import * as routerRedux from "connected-react-router";
const { connectRouter, routerMiddleware } = routerRedux;

export default function createRouter(configs: IDvaConfigs) {
  const children = getRoute(configs.routerConfigs);
  const { history, createOpts } = getCreateOptions(configs);
  const RouterComponent = () => <Router history={history}>{children}</Router>;

  return { RouterComponent, history, createOpts };
}

function getRoute(routerConfigs: IRouterConfigs, index: number = 0) {
  const { path = "", component, routes = [], defaultRouter } = routerConfigs;
  const routeProps: RouteProps = {
    path
  };

  const children: React.ReactElement[] = [];
  if (component) routeProps.component = component;
  if (routes.length) {
    routes.forEach(route => {
      children.push(getRoute(route, index + 1));
    });
  }

  if (defaultRouter) {
    children.push(
      <Redirect
        key={`defaultRouter-${index}`}
        exact
        from={routerConfigs.path}
        to={defaultRouter}
      />
    );
  }

  return index === 0 && routes.length > 0 ? (
    <Switch>{children}</Switch>
  ) : (
    <Route key={routerConfigs.path} {...routeProps}>
      {children}
    </Route>
  );
}

export function getCreateOptions(configs?: IDvaConfigs) {
  const history = configs!.history || createBrowserHistory();
  const createOpts = {
    initialReducer: {
      router: connectRouter(history)
    },
    setupMiddlewares(middlewares: any) {
      return [routerMiddleware(history), ...middlewares];
    },
    setupApp(dvaInstance: IDvaInstance) {
      dvaInstance._history = patchHistory(history);
    }
  };

  return { history, createOpts };
}

function patchHistory(history: any) {
  const oldListen = history.listen;
  history.listen = (callback: Function) => {
    callback(history.location, history.action);
    return oldListen.call(history, callback);
  };
  return history;
}

export { routerRedux, createBrowserHistory, createHashHistory };
