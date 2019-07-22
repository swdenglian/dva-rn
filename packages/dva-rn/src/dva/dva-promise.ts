/**
 * 由于EventLoop 导致 Promise.then 会滞后执行，
 * 希望同步执行
 */
export class DvaPromise<T> {
  thenFuncQueue: Function[] = [];
  rejectFuncQueue: Function[] = [];
  state: "pending" | "fulfilled" | "rejected" = "pending";
  result: any = void 0;

  constructor(
    doAction: (
      resolve?: (value?: T) => void,
      reject?: (value?: Error) => void
    ) => void
  ) {
    doAction(this.resolve, this.reject);
  }

  doFuncs = () => {
    while (this.thenFuncQueue.length) {
      this.thenFuncQueue[0](this.result);
      this.thenFuncQueue.shift();
    }
  };

  doRejectFuncs = () => {
    while (this.rejectFuncQueue.length) {
      this.rejectFuncQueue[0](this.result);
      this.rejectFuncQueue.shift();
    }
  };

  resolve = (value?: T) => {
    this.state = "fulfilled";
    this.result = value;
    this.doFuncs();
  };

  reject = (e?: Error) => {
    this.state = "rejected";
    this.result = e;
    this.doRejectFuncs();
  };

  then = (thenFunc: Function) => {
    if (this.state === "pending") {
      this.thenFuncQueue.push(thenFunc);
    } else if (this.state === "fulfilled") {
      thenFunc(this.resolve);
    }

    return this;
  };

  catch = (rejectFunc: Function) => {
    if (this.state === "pending") {
      this.thenFuncQueue.push(rejectFunc);
    } else if (this.state === "rejected") {
      rejectFunc(this.resolve);
    }

    return this;
  };
}
