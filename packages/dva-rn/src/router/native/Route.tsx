import React from "react";
import { RouteProps } from "react-router";

export const RouteDisplayName = "Route";
export default class Route<
  T extends RouteProps = RouteProps
> extends React.Component<T, any> {
  static displayName = RouteDisplayName;

  render() {
    return null;
  }
}
