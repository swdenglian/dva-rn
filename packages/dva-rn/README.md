<!--
 * @Description: README.md
 * @Author: swdenglian
 * @Date: 2019-07-15 17:04:49
 * @LastEditTime: 2019-08-09 11:07:03
 -->
# dva-rn

支持 react-native && typescript 的 dva

# 支持

- react-native
- react-native-web

> react-native 中使用的是 react-navigation。
> react-native-web 中使用的 react-router-dom。
> 后续会继续更新完善相关API。

# 安装

```shell
yarn add react-navigation react-native-gesture-handler @dva-rn/dva-rn
react-native link
```

# 样例

详细情况请看 [样例](../../packages/example/src/app.tsx)

```jsx
import {
  Dva,
  IModel,
  routerRedux,
  connect,
  createBrowserHistory
} from "@dva-rn/dva-rn";
import App from "./App";
import B from "./B";

const dva = new Dva({
  routerConfigs: {
    path: "/",
    routes: [{ path: "/a/:id", component: App }, { path: "/b", component: B }]
  },
  history: createBrowserHistory()
});

dva.model(countModel);

const App = dva.start();

export default App;
```

# License

MIT
