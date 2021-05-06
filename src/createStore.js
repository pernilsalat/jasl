import { useLayoutEffect, useRef, useState } from "react";
import { pipeActions } from "./utils/pipe";
import { identity } from "./utils/functions";

const createEmitter = () => {
  const subscriptions = new Map();

  return {
    emit: (value) => subscriptions.forEach((fn) => fn(value)),
    subscribe: (fn) => {
      const key = Symbol();
      subscriptions.set(key, fn);
      return () => subscriptions.delete(key);
    },
  };
};

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

  const useStore = (selector = identity, equalFn = Object.is) => {
    const [localStore, setLocalStore] = useState(() => selector(getState()));
    const currentSlice = useRef(localStore);

    useLayoutEffect(() => {
      api.onMount.execute();
      const subscribeWithSelector = (nextStore) => {
        const nextSlice = selector(nextStore);
        if (!equalFn(currentSlice.current, nextSlice)) {
          currentSlice.current = nextSlice;
          setLocalStore(nextSlice);
        }
      };
      const unsubscribe = emitter.subscribe(
        Object.is(selector, identity) ? setLocalStore : subscribeWithSelector
      );
      return () => {
        unsubscribe();
        api.onUnmount.execute();
      };
    }, []);

    return localStore;
  };

  return useStore;
};
