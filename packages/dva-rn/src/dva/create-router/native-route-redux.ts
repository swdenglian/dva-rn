import { Path } from "history";
import { NavigationActions, StackActions } from "react-navigation";

class RouterRedux {
  push(path: Path) {
    return NavigationActions.navigate({
      routeName: path,
      params: {}
    });
  }

  goBack() {
    return NavigationActions.back();
  }

  replace(path: Path) {
    return StackActions.replace({
      routeName: path
    });
  }
}

export default new RouterRedux();
