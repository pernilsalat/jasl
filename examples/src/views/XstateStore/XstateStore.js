import {Fragment, memo} from "react";
import {createStore} from "../../../../src/createStore";
import {devtools} from "../../../../src/middlewares/devtools";
import {xstate} from "../../../../src/middlewares/xstate";
import {persist} from "../../../../src/middlewares/persist";
import {Machine} from "xstate";
import {Code} from "./Code";

const useToggleMachineStore = createStore(
  devtools(
    persist(
      xstate(
        (set, get, api) =>
          Machine(
            {
              id: 'toggle',
              initial: 'active',
              states: {
                active: {
                  on: {
                    TOGGLE: { target: 'inactive', actions: 'incrementCount' },
                  },
                },
                inactive: {
                  on: {
                    TOGGLE: { target: 'active', actions: 'incrementCount' },
                  },
                },
              },
            },
            {
              actions: {
                incrementCount() {
                  set(
                    (context) => ({ ...context, times: context.times + 1 }),
                    'incrementCount'
                  );
                },
              },
            }
          ),
        { times: 0 }
      ),
      { name: 'xstate-counter' }
    ),
    'toggle'
  )
);

const Light = memo(() => {
  const { state, context } = useToggleMachineStore();

  return (
    <Fragment>
      <h1>
        the light is:
        <br />
        {state === 'active' ? 'open' : 'close'}
      </h1>
      <div>toggle count: {context.times}</div>
    </Fragment>
  );
});

const Toggle = memo(() => {
  const { sendEvent } = useToggleMachineStore();
  return <button onClick={() => sendEvent.toggle()}>toggle</button>;
});

export const XstateStore = () => (
  <Fragment>
    <Light />
    <Toggle />
    <Code/>
  </Fragment>
)