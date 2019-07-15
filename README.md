# dva-rn

支持 react-native && typescript  的dva

# useage

详细情况请看 [测试文件](./test/index.test.tsx)

```jsx
  import dva from 'dva-rn';

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


  class App extends React.Component{
    render(){
      return <Text>Hello World</Text>
    }
  }

  export default app.start(App);

```

# License
  
  MIT
