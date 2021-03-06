import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { pipeActions } from "./utils/pipe";
import { identity } from "./utils/functions";

const createEmitter = () => {
  const subscriptions = new Set();
  return {
    emit: (value) => subscriptions.forEach((fn) => fn(value)),
    subscribe: (fn) => {
      subscriptions.add(fn);
      return () => subscriptions.delete(fn);
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
  const mergeState = (operation) => {
    store = { ...store, ...operation(store) };
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
  store = init(mergeState, getState, api);

  const useStore = (selector = identity, equalityFn = Object.is) => {
    const [localStore, setLocalStore] = useState(() => selector(getState()));
    const currentSlice = useRef(localStore);
    const selectorRef = useRef(null);
    const equalityFnRef = useRef(null);

    const updateLocalStoreIfChanged = useCallback((nextStore = getState()) => {
      const nextSlice = selectorRef.current(nextStore);
      if (!equalityFnRef.current(currentSlice.current, nextSlice)) {
        currentSlice.current = nextSlice;
        setLocalStore(nextSlice);
      }
    }, []);

    useLayoutEffect(() => {
      const firstTime = !selectorRef.current;
      selectorRef.current = selector;
      equalityFnRef.current = equalityFn;
      if (!firstTime) updateLocalStoreIfChanged();
    }, [selector, equalityFn]);

    useLayoutEffect(() => {
      api.onMount.execute();
      const unsubscribe = emitter.subscribe(
        Object.is(selectorRef.current, identity)
          ? setLocalStore
          : updateLocalStoreIfChanged
      );
      return () => {
        unsubscribe();
        api.onUnmount.execute();
      };
    }, []);

    return localStore;
  };

  Object.assign(useStore, api);

  return useStore;
};
