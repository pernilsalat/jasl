import merge from 'lodash.merge'

export const persist = (init, options) => (set, get, api) => {
  const {
    name,
    getStorage = () => localStorage,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    blacklist,
    whitelist,
    onRehydrateStorage,
    version = 0,
    migrate,
  } = options || {};

  let storage;

  try {
    storage = getStorage();
  } catch (e) {
    // prevent error if the storage is not defined (e.g. when server side rendering a page)
  }

  if (!storage) {
    return init(
      (...args) => {
        console.warn(
          `Persist middleware: unable to update ${name}, the given storage is currently unavailable.`
        );
        set(...args);
      },
      get,
      api
    );
  }

  const setItem = async () => {
    const state = { ...get() };

    if (whitelist) {
      Object.keys(state).forEach((key) => {
        !whitelist.includes(key) && delete state[key];
      });
    }
    if (blacklist) {
      blacklist.forEach((key) => delete state[key]);
    }

    return storage?.setItem(name, await serialize({ state, version }));
  };

  const savedSetState = api.setState;

  api.setState = (state, replace) => {
    savedSetState(state, replace);
    void setItem();
  };

  // rehydrate initial state with existing stored state
  (async () => {
    const postRehydrationCallback = onRehydrateStorage?.(get()) || undefined;

    try {
      const storageValue = await storage.getItem(name);
      if (storageValue) {
        const deserializedStorageValue = await deserialize(storageValue);

        // if versions mismatch, run migration
        if (deserializedStorageValue.version !== version) {
          const migratedState = await migrate?.(
            deserializedStorageValue.state,
            deserializedStorageValue.version
          );
          if (migratedState) {
            set(
              (state) => merge({}, state, migratedState),
              '@@MIGRATED'
            );
            await setItem();
          }
        } else {
          set(
            (state) => merge({}, state, deserializedStorageValue.state),
            '@@HYDRATE'
          );
        }
      }
    } catch (e) {
      postRehydrationCallback?.(undefined, e);
      return;
    }

    postRehydrationCallback?.(get(), undefined);
  })();

  return init(
    (...args) => {
      set(...args);
      void setItem();
    },
    get,
    api
  );
};
