import React from "react";
import { View, Text, Button } from "react-native";
import { Dispatch } from "redux";
import dva, {
  Model,
  connect,
  getCreateOptions,
  router,
  createBrowserHistory,
  routerRedux
} from "@dva-rn/dva-rn";

const { Router, Route } = router;

interface AppStateType {
  count: number;
}

interface CountNameSpaceModel extends Model {
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

const history = createBrowserHistory();
const app = dva({}, getCreateOptions({ history }));
app.model(countModel);

interface AppProps {
  count?: number;
  dispatch?: Dispatch<any>;
}

class AppContent extends React.Component<AppProps> {
  render() {
    const { count, dispatch } = this.props;
    console.log(app.getStore().getState());
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

const App = connect((state: AppStateType, ownProps) => {
  console.log(ownProps);
  const { count } = state;
  return { count };
})(AppContent);

const B = class extends React.Component {
  render() {
    console.log(app.getStore().getState());
    return "1";
  }
};

const StartedApp = app.start(() => {
  return (
    <Router history={history}>
      <Route path="/">
        <Route path="/b" exact component={B} />
        <Route path="/a/:id" component={App} />
      </Route>
    </Router>
  );
});

export default class extends React.PureComponent {
  render() {
    return React.createElement(StartedApp);
  }
}
