import type { LoadingBarRef } from "react-top-loading-bar";

let loadingBarRef: LoadingBarRef | null = null;
let pendingRequests = 0;

const startBar = () => {
  loadingBarRef?.continuousStart();
};

const completeBar = () => {
  loadingBarRef?.complete();
};

export const loadingBarController = {
  register(ref: LoadingBarRef | null) {
    loadingBarRef = ref;
    if (pendingRequests > 0 && loadingBarRef) {
      startBar();
    }
  },
  unregister(ref: LoadingBarRef | null) {
    if (ref && ref !== loadingBarRef) {
      return;
    }
    loadingBarRef = null;
    pendingRequests = 0;
  },
  startRequest() {
    pendingRequests += 1;
    if (pendingRequests === 1) {
      startBar();
    }
  },
  finishRequest() {
    if (pendingRequests === 0) {
      return;
    }
    pendingRequests -= 1;
    if (pendingRequests === 0) {
      completeBar();
    }
  }
};
