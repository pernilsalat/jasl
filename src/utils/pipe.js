export const pipe = (...fns) => (value) =>
  fns.reduce((acc, act) => act(acc), value);

export const pipeActions = () => ({
  actions: [],
  add(action) {
    this.actions.push(action);
  },
  execute() {
    pipe(...this.actions)();
  },
});
