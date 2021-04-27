export const redux = (reducer, init) => (set, get, api) => {
  api.dispatch = (action) => {
    set((state) => reducer(state, action));
    if (api.devtools) {
      api.devtools.send(api.devtools.prefix + action.type, get());
    }
    return action;
  };
  const initialState = init(set, get, api);
  return { dispatch: api.dispatch, ...initialState };
};
