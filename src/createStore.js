import { useLayoutEffect, useState } from "react";
import { pipeActions } from "./utils/pipe";
import { identity } from "./utils/functions";

const createEmitter = () => {
  const subscriptions = new Map();

  return {
    emit: (value) => subscriptions.forEach((fn) => fn(value)),
    subscribe: (fn) => {
      // eslint-disable-next-line no-new-symbol
      const key = Symbol();
      subscriptions.set(key, fn);
      return () => subscriptions.delete(key);
    },
  };
};

// const debounce = (fn, timeout) => {
//   let timer,
//     parameters = {};
//   return (...args) => {
//     parameters = { ...parameters, ...args };
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       fn.apply(this, args);
//     }, timeout);
//   };
// };
export const createStore = (init) => {
  const emitter = createEmitter();

  let store = null;
  const getState = () => store;
  const setState = (operation) => {
    store = operation(store);
    emitter.emit(store);
  };

  const subscribe = (listener) => emitter.subscribe(listener);
  const api = {
    getState,
    setState,
    subscribe,
    onMount: pipeActions(),
    onUnmount: pipeActions(),
  };
  store = init(setState, getState, api);

  const useStore = (selector = identity) => {
    const [localStore, setLocalStore] = useState(getState());

    useLayoutEffect(() => {
      api.onMount.execute();
      const unsubscribe = emitter.subscribe(setLocalStore);
      return () => {
        unsubscribe();
        api.onUnmount.execute();
      };
    }, []);

    return selector(localStore);
  };

  return useStore;
};
