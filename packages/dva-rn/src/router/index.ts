import * as router from "./native";
import React, { ReactElement } from "react";
import createBrowserHistory from "./native/createHistory";
import routerRedux from "./native/routerRedux";
import Router, { IRouterProps } from "./native/Router";
// import { DvaOption } from "../";

function patchHistory(history: any) {}

export function getCreateOptions(opts: any = {}): any {
  const { history, setupApp } = opts;

  let r: any;
  let routerRef: any = null;
  if (history) {
    console.log(history);
    r = React.cloneElement(history, {
      ref: (node: any) => {
        routerRef = node;
        const { ref } = history;
        if (typeof ref === "function") {
          ref(node);
        }
      }
    });

    setupApp!(r);
  }

  return {};
}

export { createBrowserHistory };
export { router };
export { routerRedux };
