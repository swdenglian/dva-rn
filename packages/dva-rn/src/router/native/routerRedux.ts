import { Path, LocationState } from "history";

export interface LocationActionPayload<A = any[]> {
  method: string;
  args?: A;
}
export const LOCATION_CHANGE = "@@router/LOCATION_CHANGE";
export const CALL_HISTORY_METHOD = "@@router/CALL_HISTORY_METHOD";

export interface CallHistoryMethodAction<A = any[]> {
  type: typeof CALL_HISTORY_METHOD;
  payload: LocationActionPayload<A>;
}

class RouterRedux {
  push(
    path: Path,
    state?: LocationState
  ): CallHistoryMethodAction<[Path, LocationState?]> {
    return {
      type: CALL_HISTORY_METHOD,
      payload: {
        method: ""
      }
    };
  }
}

const routerRedux = new RouterRedux();
export default routerRedux;
