import React from "react";
import { IDvaInstance, IDvaConfigs, IModel, IHooks } from "./dva-types";
import {
  createBrowserHistory,
  createMemoryHistory,
  createHashHistory
} from "history";
import * as routerRedux from "connected-react-router";
import { connect } from "react-redux";

import createWebRouter from "./create-router";
import { DvaPromise } from "./dva-promise";
const { connectRouter, routerMiddleware } = routerRedux;

const { create } = require("dva-core");

export {
  routerRedux,
  createBrowserHistory,
  createMemoryHistory,
  createHashHistory,
  connect
};
export default class Dva {
  RootComponent?: React.ComponentType<any>;
  dvaInstance?: IDvaInstance;
  configs: IDvaConfigs;
  // dva-core 未初始化的时候，存储用户操作
  doPromise: DvaPromise<IDvaInstance>;
  // 触发 doPromise 的 resolve, 会在Dva.start 中触发
  doPromiseResolve = (value?: IDvaInstance) => {};

  constructor(configs: IDvaConfigs) {
    this.configs = configs;
    this.doPromise = new DvaPromise(resolve => {
      if (resolve) {
        this.doPromiseResolve = resolve;
      }
    });
  }

  start() {
    if (!this.dvaInstance) {
      const history = this.configs!.history || createHashHistory();
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

      this.dvaInstance = create({ history }, createOpts);
      if (!this.dvaInstance!._store) {
        this.dvaInstance!.start();
        this.doPromiseResolve(this.dvaInstance);
        if (this.dvaInstance && this.dvaInstance._store) {
          const { _store } = this.dvaInstance;
          this.RootComponent = createWebRouter(
            this.configs!.routerConfigs,
            history,
            _store
          );
        }
      }
    }

    return this.RootComponent;
  }

  model(model: IModel) {
    this.doPromise.then(() => this.dvaInstance!.model(model));
  }

  unmodel(namespace: string) {
    this.doPromise.then(() => this.dvaInstance!.unmodel(namespace));
  }

  use(hooks: IHooks) {
    this.doPromise.then(() => this.dvaInstance!.use(hooks));
  }

  getStore() {
    return this.dvaInstance!._store;
  }
}

function patchHistory(history: any) {
  const oldListen = history.listen;
  history.listen = (callback: Function) => {
    callback(history.location, history.action);
    return oldListen.call(history, callback);
  };
  return history;
}
