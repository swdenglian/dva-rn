console.log("dva-rn");
import {
  createStackNavigator,
  NavigationRouteConfigMap,
  NavigationContainer
} from "react-navigation";

import {
  createReduxContainer,
  createReactNavigationReduxMiddleware,
  createNavigationReducer
} from "react-navigation-redux-helpers";
import routerRedux from "./native-route-redux";

import { IRouterConfigs, IDvaConfigs } from "../dva-types";
import { connect } from "react-redux";

export default function createRouter(configs: IDvaConfigs) {
  const AppNavigator = createNavigator(configs.routerConfigs);
  const { history, createOpts } = getCreateOptions(AppNavigator);
  const RouterComponent: any = connect(mapStateToProps)(createReduxContainer(
    AppNavigator
  ) as any);

  return { RouterComponent, history, createOpts };
}

export function getCreateOptions(navigationContainer: NavigationContainer) {
  const routerReducer = createNavigationReducer(navigationContainer);
  const routerMiddleware = createReactNavigationReduxMiddleware(
    (state: any) => state.router,
    "root"
  );
  const createOpts = {
    initialReducer: {
      router: routerReducer
    },
    setupMiddlewares(middlewares: any) {
      return [routerMiddleware, ...middlewares];
    }
  };

  return { history: {} as History, createOpts };
}

export { routerRedux, createBrowserHistory, createHashHistory };

function createNavigator(routerConfigs: IRouterConfigs) {
  const { routes = [], defaultRouter } = routerConfigs;
  const navigationRouteConfigMap: NavigationRouteConfigMap = {};
  for (let i = 0; i < routes.length; i += 1) {
    const route = routes[i];
    navigationRouteConfigMap[route.path] = {
      screen: route.component
    };
  }

  return createStackNavigator(
    navigationRouteConfigMap,
    defaultRouter
      ? {
          initialRouteName: defaultRouter
        }
      : {}
  );
}

const mapStateToProps = (state: any) => ({
  state: state.router
});

const createBrowserHistory = () => {
  return {} as History;
};

const createHashHistory = () => {
  return {} as History;
};
