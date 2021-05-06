import { Fragment } from "react";
import { Code } from "./Code";
import { createStore, devtools, redux, persist } from "jasl";
// import { createStore, devtools, redux, persist } from "../../../../src";

const reducer = (state, action) => {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + 1 };
    case "decrement":
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
};

const useCountStoreRedux = createStore(
  devtools(
    persist(
      redux(reducer, (set, get, api) => ({
        count: 0,
        increment: () => api.dispatch({ type: "increment" }),
        decrementAction: { type: "decrement" },
      })),
      { name: "count-redux", whitelist: ["count"] }
    ),
    "counterRedux"
  )
);

const Increment = () => {
  const increment = useCountStoreRedux((state) => state.increment);
  return <button onClick={increment}>increment</button>;
};

const customEqual = (obj1, obj2) => {
  return (
    obj1.decrementAction.type === obj2.decrementAction.type &&
    Object.is(obj1.dispatch, obj2.dispatch)
  );
};

const Decrement = () => {
  const { decrementAction, dispatch } = useCountStoreRedux(
    ({ decrementAction, dispatch }) => ({
      decrementAction,
      dispatch,
    }),
    customEqual
  );
  return <button onClick={() => dispatch(decrementAction)}>decrement</button>;
};

const Count = () => {
  const count = useCountStoreRedux((state) => state.count * 2);
  return <h1>{count}</h1>;
};

export const ReduxStore = () => (
  <Fragment>
    <Count />
    <Increment />
    <Decrement />
    <Code />
  </Fragment>
);
