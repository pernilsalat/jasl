import { Fragment, memo } from "react";
import { createStore } from "../../../../src/createStore";
import { devtools } from "../../../../src/middlewares/devtools";
import { persist } from "../../../../src/middlewares/persist";
import { Code } from "./Code";

const useCountStore = createStore(
  devtools(
    persist(
      (set, get) => ({
        count: 0,
        increment: () =>
          set((store) => ({ ...store, count: store.count + 1 }), "increment"),
        decrement: () =>
          set((store) => ({ ...store, count: store.count - 1 }), "decrement"),
      }),
      { name: "normal-store" }
    ),
    "counter"
  )
);

const Increment = memo(() => {
  const { increment } = useCountStore();
  return <button onClick={increment}>increment</button>;
});

const Decrement = memo(() => {
  const { decrement } = useCountStore();
  return <button onClick={decrement}>decrement</button>;
});

const Count = memo(() => {
  const count = useCountStore((state) => state.count * 2);
  return <h1>{count}</h1>;
});

export const NormalStore = () => (
  <Fragment>
    <Count />
    <Increment />
    <Decrement />
    <Code />
  </Fragment>
);
