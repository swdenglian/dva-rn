import React from "react";
import { View, Text, Button } from "react-native";
import { Dispatch } from "redux";
import dva, { Model, connect } from "@dva-rn/dva-rn";

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

const app = dva();
app.model(countModel);

interface AppProps {
  count?: number;
  dispatch?: Dispatch;
}

const AppContent = (props: AppProps) => {
  const { count, dispatch } = props;
  return (
    <View>
      <Text>{count}</Text>
      <Button
        title="add"
        onPress={() => dispatch && dispatch({ type: "count/add" })}
      />
    </View>
  );
};

const App = connect((state: AppStateType) => {
  const { count } = state;
  return { count };
})(AppContent);

export default app.start(() => <App />);
