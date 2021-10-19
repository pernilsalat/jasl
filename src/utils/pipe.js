export const pipe = (...fns) => (value) =>
  fns.reduce((acc, act) => act(acc), value);

export const pipeActions = () => {
  const _actions = [];
  const addAction = (action) => {
    _actions.push(action);
  };
  const execute = () => pipe(..._actions)();

  return Object.assign(addAction, { execute });
};
