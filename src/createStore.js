import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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

  // const subscribe = (listener) => emitter.subscribe(listener);
  const api = {
    getState,
    setState,
    // subscribe,
    onMount: pipeActions(),
    onUnmount: pipeActions(),
  };
  store = init(setState, getState, api);

  const useStore = (selector = identity, equalityFn = Object.is) => {
    const [localStore, setLocalStore] = useState(() => selector(getState()));
    const currentSlice = useRef(localStore);
    const selectorRef = useRef(selector);
    const equalityFnRef = useRef(equalityFn);

    const updateLocalStoreIfChanged = useCallback((nextStore = getState()) => {
      const nextSlice = selectorRef.current(nextStore);
      if (!equalityFnRef.current(currentSlice.current, nextSlice)) {
        currentSlice.current = nextSlice;
        setLocalStore(nextSlice);
      }
    }, []);

    useLayoutEffect(() => {
      selectorRef.current = selector;
      equalityFnRef.current = equalityFn;
      updateLocalStoreIfChanged();
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
