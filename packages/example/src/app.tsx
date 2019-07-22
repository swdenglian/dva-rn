import React from "react";
import { View, Text, Button } from "react-native";
import { Dispatch } from "redux";
import {
  Dva,
  IModel,
  routerRedux,
  connect,
  createBrowserHistory
} from "@dva-rn/dva-rn";

interface AppProps {
  count?: number;
  dispatch?: Dispatch<any>;
}

class AppContent extends React.Component<AppProps> {
  render() {
    const { count, dispatch } = this.props;
    console.log(dva.getStore()!.getState());
    return (
      <View>
        <Text>{count}</Text>
        <Button
          title="add"
          onPress={() => dispatch && dispatch({ type: "count/add" })}
        />
        <Button
          title="router"
          onPress={() => {
            dispatch && dispatch(routerRedux.push("/b"));
          }}
        />
      </View>
    );
  }
}

// const App = AppContent;
const App = connect((state: AppStateType, ownProps) => {
  console.log(ownProps);
  const { count } = state;
  return { count };
})(AppContent);

const B = class extends React.Component {
  render() {
    return <Text>111</Text>;
  }
};

// app start------------------------------------------

interface AppStateType {
  count: number;
}

interface CountNameSpaceModel extends IModel {
  state: number;
  reducers: {
    add(state: number): number;
  };
}

const countModel: CountNameSpaceModel = {
  namespace: "count",
  state: 0,
  reducers: {
    add(state) {
      return state + 1;
    }
  }
};

const dva = new Dva({
  routerConfigs: {
    path: "/",
    routes: [{ path: "/a/:id", component: App }, { path: "/b", component: B }]
  },
  history: createBrowserHistory()
});

dva.model(countModel);

const StartedApp = dva.start();

setTimeout(() => console.log(dva.getStore()!.getState()), 3000);

export default class extends React.PureComponent {
  render() {
    return StartedApp ? React.createElement(StartedApp) : null;
  }
}
