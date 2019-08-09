/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-22 09:38:50
 * @LastEditTime: 2019-08-09 10:07:54
 */
import { ComponentType } from "react";
import { History } from "history";
import {
  Reducer,
  ReducersMapObject,
  Dispatch,
  StoreEnhancer,
  Store,
  MiddlewareAPI,
  AnyAction
} from "redux";

export interface IRouterConfigs {
  path: string;
  defaultRouter?: string;
  component?: ComponentType<any>;
  routes?: IRouterConfigs[];
}

export interface IDvaConfigs {
  routerConfigs: IRouterConfigs;
  history?: any;
  otherWrapper?: (router: React.ReactElement) => React.ReactElement;
}

export type IDvaOption = IHooks & {
  namespacePrefixWarning?: boolean;
  initialState?: Object;
  history?: any;
};

export interface IDvaInstance {
  use: (hooks: IHooks) => void;
  model: (model: IModel) => void;
  unmodel: (namespace: string) => void;
  start: (rootComponent?: React.ComponentType) => React.ComponentType;
  getStore: () => Store;
  _history?: any;
  _store?: Store<any>;
}

export interface IHooks {
  onError?: (e: Error, dispatch: Dispatch<any>) => void;
  onAction?: onActionFunc | onActionFunc[];
  onStateChange?: () => void;
  onReducer?: ReducerEnhancer;
  onEffect?: () => void;
  extraReducers?: ReducersMapObject;
  extraEnhancers?: StoreEnhancer<any>[];
}

export interface IModel {
  namespace: string;
  state?: any;
  reducers?: ReducersMapObject | ReducersMapObjectWithEnhancer;
  effects?: EffectsMapObject;
  subscriptions?: SubscriptionsMapObject;
}

export type Effect = (action: AnyAction, effects: EffectsCommandMap) => void;
export type EffectType = "takeEvery" | "takeLatest" | "watcher" | "throttle";
export type EffectWithType = [Effect, { type: EffectType }];
export type Subscription = (api: SubscriptionAPI, done: Function) => void;
export type ReducersMapObjectWithEnhancer = [
  ReducersMapObject,
  ReducerEnhancer
];

export interface onActionFunc {
  (api: MiddlewareAPI<any>): void;
}

export interface ReducerEnhancer {
  (reducer: Reducer<any>): void;
}

export interface EffectsMapObject {
  [key: string]: Effect | EffectWithType;
}

export interface SubscriptionsMapObject {
  [key: string]: Subscription;
}

export interface EffectsCommandMap {
  put: <A extends AnyAction>(action: A) => any;
  call: Function;
  select: Function;
  take: Function;
  cancel: Function;
  [key: string]: any;
}

export interface SubscriptionAPI {
  history: History;
  dispatch: Dispatch<any>;
}
