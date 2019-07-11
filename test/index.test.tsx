import dva from "../src/index";
import React from "react";

class App extends React.Component {
  render() {
    return <div>hello_world</div>;
  }
}

test("app.start() return  a React.ComponentType", () => {
  let app = dva();
  const RootComponent = app.start(App);
  const RootElement = React.createElement(RootComponent);
  expect(React.isValidElement(RootElement)).toBe(true);
});

test("dva model test", () => {
  let app = dva();
  app.model({
    namespace: "a",
    state: 0,
    reducers: {
      add(state) {
        return state + 1;
      }
    }
  });

  app.start(App);

  app.model({
    namespace: "b",
    state: 0,
    reducers: {
      add(state) {
        return state + 1;
      }
    },
    effects: {
      *addBoth(action, { put }) {
        yield put({ type: "a/add" });
        yield put({ type: "add" });
      }
    }
  });

  app.getStore().dispatch({ type: "b/addBoth" });
  const { a, b } = app.getStore().getState();
  expect({ a, b }).toEqual({ a: 1, b: 1 });
});
