export const devtools = (init, prefix) => (set, get, api) => {
  let extension;
  try {
    extension =
      window.__REDUX_DEVTOOLS_EXTENSION__ ||
      window.top.__REDUX_DEVTOOLS_EXTENSION__;
  } catch {}

  if (!extension) {
    if (
      process.env.NODE_ENV === 'development' &&
      typeof window !== 'undefined'
    ) {
      console.warn('Please install/enable Redux devtools extension');
    }
    api.devtools = null;
    return init(set, get);
  }

  const namedSet = (operation, name = '') => {
    set(operation);
    if (!api.dispatch || name.startsWith('@@')) {
      api.devtools.send(api.devtools.prefix + (name || 'action'), get());
    }
  };

  const initialState = init(namedSet, get, api);
  if (!api.devtools) {
    const savedSetState = api.setState;
    api.setState = (operation) => {
      savedSetState(operation);
      api.devtools.send(api.devtools.prefix + 'setState', api.getState());
    };
    api.devtools = extension.connect({ name: prefix });
    api.devtools.prefix = prefix ? `${prefix} > ` : '';
    api.devtools.subscribe((message) => {
      if (message.type === 'DISPATCH' && message.state) {
        const ignoreState =
          message.payload.type === 'JUMP_TO_ACTION' ||
          message.payload.type === 'JUMP_TO_STATE';
        if (!api.dispatch && !ignoreState) {
          api.setState(JSON.parse(message.state));
        } else {
          savedSetState(JSON.parse(message.state));
        }
      } else if (
        message.type === 'DISPATCH' &&
        message.payload?.type === 'COMMIT'
      ) {
        api.devtools.init(api.getState());
      }
    });
    api.devtools.init(initialState);
  }
  return initialState;
};
