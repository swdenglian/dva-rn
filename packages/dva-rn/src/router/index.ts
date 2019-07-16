// import invariant from "invariant";
import {
  createBrowserHistory,
  createMemoryHistory,
  createHashHistory
} from "history";
import * as router from "react-router-dom";
import * as routerRedux from "connected-react-router";
import { DvaOption } from "../";

const { connectRouter, routerMiddleware } = routerRedux;

function patchHistory(history: any) {
  const oldListen = history.listen;
  history.listen = (callback: any) => {
    callback(history.location, history.action);
    return oldListen.call(history, callback);
  };
  return history;
}

export function getCreateOptions(opts: DvaOption = {}): DvaOption {
  const history = opts.history || createHashHistory();
  return {
    initialReducer: {
      router: connectRouter(history)
    },
    setupMiddlewares(middlewares: any) {
      return [routerMiddleware(history), ...middlewares];
    },
    setupApp(app: any) {
      app._history = patchHistory(history);
    }
  };
}

export { createBrowserHistory, createMemoryHistory, createHashHistory };
export { router };
export { routerRedux };
