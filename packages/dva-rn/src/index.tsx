import React from "react";
import { bindActionCreators, Store } from "redux";
import { Provider } from "react-redux";
import { DvaInstance, DvaOption } from "./types/dva-core";
const { create } = require("dva-core");

export default function dva(opts?: DvaOption): DvaInstance {
  const app = create(opts);
  const oldAppStart = app.start;

  app.start = (rootComponent: React.ComponentType) => {
    if (!app._store) {
      oldAppStart.call(app);
    }

    return function() {
      return (
        <Provider store={app._store}>
          {React.createElement(rootComponent)}
        </Provider>
      );
    };
  };

  app.getStore = (): Store => {
    return app._store;
  };

  return app;
}

export { bindActionCreators };

export {
  connect,
  connectAdvanced,
  useSelector,
  useDispatch,
  useStore,
  shallowEqual
} from "react-redux";
