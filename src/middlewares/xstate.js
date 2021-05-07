import { noop } from "../utils/functions";
import { interpret, State } from "xstate";
import { camelize } from "../utils/string";

export const xstate = (
  initMachine,
  initialContext,
  interpretOptions,
  onTransition = noop
) => (set, get, api) => {
  const contextSet = (operation, ...options) => {
    set(
      (state) => ({ ...state, context: operation(state.context) }),
      ...options
    );
  };
  const machine = initMachine(contextSet, get, api);
  const service = interpret(machine, interpretOptions).onTransition(
    (serviceState) => {
      if (serviceState.changed && serviceState.value !== get().state)
        set(
          (state) => ({ ...state, state: serviceState.value }),
          "stateUpdate"
        );
      onTransition(serviceState);
    }
  );
  api.onMount.add(() => {
    function start() {
      const { state } = get();
      service.start(state);
    }
    const { value, then } = api.loading;
    value ? then(start) : start();
  });
  api.onUnmount.add(() => service.stop());
  api.service = service;

  const { initialStateValue, events } = machine;
  const sendEvent = events.reduce(
    (acc, act) => ({
      ...acc,
      [camelize(act)]: (params) => service.send({ type: act, ...params }),
    }),
    {}
  );

  return {
    state: initialStateValue,
    context: initialContext,
    sendEvent,
  };
};
