import React, { ReactNode } from "react";
import {
  createStackNavigator,
  // createAppContainer,
  NavigationRouteConfigMap,
  NavigationContainer
} from "react-navigation";
import { createReduxContainer } from "react-navigation-redux-helpers";
import { RouterProps } from "react-router";
import Route from "./Route";

export interface IRouterProps extends RouterProps {
  children?: any;
}

interface IRouterConfigs {
  path: string;
  component?: null | React.ComponentType;
  children?: IRouterConfigs[];
}

export default class Router extends React.Component<IRouterProps, any> {
  Root: React.ComponentType<any> = () => null;
  navigationContainer: NavigationContainer;

  constructor(props: IRouterProps) {
    super(props);
    const config = this.getConfigFromChildren(props.children);
    this.navigationContainer = this.createStackNavigationApp(config);
    this.Root = createReduxContainer(this.navigationContainer);
  }

  getConfigFromChildren = (children: any) => {
    const configs: IRouterConfigs = {
      path: ""
    };

    if (children.type.displayName === Route.displayName) {
      const { path, children: nextChildren, component } = children.props;
      configs.path = path;
      configs.component = component;
      configs.children = [];

      const _nextChildren: ReactNode[] = nextChildren as ReactNode[];
      if (_nextChildren && _nextChildren.length > 0) {
        for (let i = 0; i < _nextChildren.length; i += 1) {
          configs.children.push(this.getConfigFromChildren(_nextChildren[i]));
        }
      }
    }

    return configs;
  };

  routerConfigToNavigationConfig = (configs: IRouterConfigs) => {
    const navigationConfigs: NavigationRouteConfigMap = {};
    const children = configs.children;
    if (children && children.length) {
      for (let i = 0; i < children.length; i += 1) {
        const child = children[i];
        navigationConfigs[child.path] = {
          screen: child.component
        };
      }
    }

    return navigationConfigs;
  };

  createStackNavigationApp = (configs: IRouterConfigs) => {
    return createStackNavigator(this.routerConfigToNavigationConfig(configs), {
      initialRouteName:
        configs.children && configs.children[0] && configs.children[0].path
    });
  };

  render() {
    console.log(this.Root, this.props);
    return React.createElement(this.Root);
  }
}
