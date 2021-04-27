import {Fragment, memo} from "react";
import {createStore} from "../../../../src/createStore";
import {devtools} from "../../../../src/middlewares/devtools";
import {redux} from "../../../../src/middlewares/redux";
import {persist} from "../../../../src/middlewares/persist";
import {Code} from "./Code";

const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'decrement':
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
        increment: () => api.dispatch({ type: 'increment' }),
        decrementAction: { type: 'decrement' },
      })),
      { name: 'count-redux' }
    ),
    'counterRedux'
  )
);

const Increment = memo(() => {
  const { increment } = useCountStoreRedux();
  return <button onClick={increment}>increment</button>;
});

const Decrement = memo(() => {
  const { decrementAction, dispatch } = useCountStoreRedux();
  return <button onClick={() => dispatch(decrementAction)}>decrement</button>;
});

const Count = memo(() => {
  const count = useCountStoreRedux((state) => {
    return state.count * 2;
  });
  return <h1>{count}</h1>;
});

export const ReduxStore = () => (
  <Fragment>
    <Count/>
    <Increment/>
    <Decrement/>
    <Code/>
  </Fragment>
)