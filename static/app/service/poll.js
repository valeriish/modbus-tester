import { store, addCallbackOnStoreChange } from "./store.js";

class PollManager {
  timeout = 1000;
  timer = null;
  callback = null;

  constructor(timeout) {
    this.timeout = timeout ?? 1000;
  }

  setTimeout(timeout) {
    this.timeout = timeout ?? this.timeout;
  }

  setCallback(callback) {
    this.callback = callback;
  }

  start(callback) {
    if (this.timer) {
      this.stop();
    }
    if (callback) {
      this.setCallback(callback);
    }
    if (!this.callback) {
      return;
    }
    this.timer = setInterval(this.callback, this.timeout);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export const poll = new PollManager(store.timeout);

addCallbackOnStoreChange((newState) => {
  if ("timeout" in newState && newState.timeout) {
    poll.setTimeout(newState.timeout);
  }
});
