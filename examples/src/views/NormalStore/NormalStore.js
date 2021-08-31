import { Fragment } from "react";
import { createStore, devtools, persist } from "jasl";
// import { createStore, devtools, persist } from "../../../../src";
import { Code } from "./Code";

const useCountStore = createStore(
  devtools(
    persist(
      (set, get) => ({
        count: 0,
        increment: () =>
          set((store) => ({ count: store.count + 1 }), "increment"),
        decrement: () =>
          set((store) => ({ count: store.count - 1 }), "decrement"),
      }),
      { name: "normal-store" }
    ),
    "counter"
  )
);

const Increment = () => {
  const increment = useCountStore((state) => state.increment);
  return <button onClick={increment}>increment</button>;
};

const Decrement = () => {
  const decrement = useCountStore(({ decrement }) => decrement);
  return <button onClick={decrement}>decrement</button>;
};

const Count = () => {
  const count = useCountStore((state) => state.count * 2);
  return <h1>{count}</h1>;
};

export const NormalStore = () => (
  <Fragment>
    <Count />
    <Increment />
    <Decrement />
    <Code />
  </Fragment>
);
