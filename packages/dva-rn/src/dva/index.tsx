import React from "react";
import {
  IDvaInstance,
  IDvaConfigs,
  IModel,
  IHooks,
  IRouterConfigs
} from "./dva-types";
import { connect, Provider } from "react-redux";

import createRouter, {
  routerRedux,
  createBrowserHistory,
  createHashHistory
} from "./create-router";
import { DvaPromise } from "./dva-promise";

const { create } = require("dva-core");

export {
  routerRedux,
  createBrowserHistory,
  createHashHistory,
  connect,
  IRouterConfigs
};
export default class Dva {
  RootComponent: React.ComponentType<any> = () => null;
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
      const { RouterComponent, history, createOpts } = createRouter(
        this.configs
      );

      this.dvaInstance = create({ history }, createOpts);

      if (!this.dvaInstance!._store) {
        let otherWrapper = this.configs.otherWrapper;
        this.dvaInstance!.start();
        this.doPromiseResolve(this.dvaInstance);
        if (this.dvaInstance && this.dvaInstance._store) {
          const { _store } = this.dvaInstance;
          this.RootComponent = () => (
            <Provider store={_store}>
              {otherWrapper ? (
                otherWrapper(<RouterComponent />)
              ) : (
                <RouterComponent />
              )}
            </Provider>
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
