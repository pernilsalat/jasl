import { Fragment } from "react";
import { Machine } from "xstate";
import { Code } from "./Code";
import { createStore, devtools, xstate, persist } from "jasl";
// import { createStore, devtools, xstate, persist } from "../../../../src";

const useToggleMachineStore = createStore(
  devtools(
    persist(
      xstate(
        (set, get, api) =>
          Machine(
            {
              id: "toggle",
              initial: "active",
              states: {
                active: {
                  on: {
                    TOGGLE: { target: "inactive", actions: "incrementCount" },
                  },
                },
                inactive: {
                  on: {
                    TOGGLE: { target: "active", actions: "incrementCount" },
                  },
                },
              },
            },
            {
              actions: {
                incrementCount() {
                  set(
                    (context) => ({ times: context.times + 1 }),
                    "incrementCount"
                  );
                },
              },
            }
          ),
        { times: 0 }
      ),
      { name: "xstate-counter" }
    ),
    "toggle"
  )
);

const Light = () => {
  const { state, context } = useToggleMachineStore();
  return (
    <Fragment>
      <h1>
        the light is:
        <br />
        {state === "active" ? "open" : "close"}
      </h1>
      <div>toggle count: {context.times}</div>
    </Fragment>
  );
};

const Toggle = () => {
  const sendEvent = useToggleMachineStore((state) => state.sendEvent);
  return <button onClick={() => sendEvent.toggle()}>toggle</button>;
};

export const XstateStore = () => (
  <Fragment>
    <Light />
    <Toggle />
    <Code />
  </Fragment>
);
