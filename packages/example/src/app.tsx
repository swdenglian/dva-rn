import React from "react";
import { View, Text, Button,TextInput } from "react-native";
import { Dispatch } from "redux";
import {
  Dva,
  IModel,
  routerRedux,
  connect,
  createBrowserHistory
} from "@dva-rn/dva-rn";

interface AppProps {
  count: number;
}

interface IAppActions {
  dispatch?: Dispatch;
}

class AppContent extends React.Component<AppProps & IAppActions> {
  render() {
    const { count, dispatch } = this.props;
    console.log(dva.getStore()!.getState());
    return (
      <View>
        <Text>A</Text>
        <Text>{count}</Text>
        <TextInput />
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

const App = connect<AppProps>(
  (state: AppStateType): AppProps => {
    const { count } = state;
    return { count: count ? count : 0 };
  }
)(AppContent);

const B = connect<AppProps>(
  (state: AppStateType): AppProps => {
    const { count } = state;
    return { count: count ? count : 0 };
  }
)( class extends React.Component<{ a: string } & IAppActions> {
  render() {
    const { dispatch } = this.props;
    return <View>
      <Text>B</Text>
      <TextInput />
      <Button
          title="router"
          onPress={() => {
            dispatch && dispatch(routerRedux.push("/a/:id"));
          }}
        />
    </View>;
  }
});

class C extends React.Component<{ a: string }> {
  render() {
    return <Text>C</Text>;
  }
}

// app start------------------------------------------

interface AppStateType {
  count?: number;
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
    defaultRouter: "/c",
    routes: [
      { path: "/a/:id", component: App , catch:{ when:"forward" }},
      { path: "/b", component: B , catch:{ when:"always" }},
      { path: "/c", component: C }
    ]
  },
  history: createBrowserHistory()
  // otherWrapper: (v: any) => {
  //   return (
  //     <View>
  //       <Text>11111</Text>
  //       {v}
  //     </View>
  //   );
  // }
});

dva.model(countModel);

const StartedApp = dva.start();
console.log(dva.getStore()!.getState());

export default class extends React.PureComponent {
  render() {
    return StartedApp ? <StartedApp /> : null;
  }
}
