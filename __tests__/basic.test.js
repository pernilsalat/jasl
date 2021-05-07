import React, { useEffect } from "react";
import { createStore } from "../src/createStore";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { unstable_batchedUpdates } from "react-dom";

describe("basic tests", () => {
  const consoleError = console.error;
  afterEach(() => {
    cleanup();
    console.error = consoleError;
  });

  test("creates a store hook", () => {
    const useStoreHook = createStore(() => {});
    expect(useStoreHook).toMatchInlineSnapshot("[Function]");
  });

  test("uses the store hook without selector", async () => {
    const useStoreHook = createStore((set) => ({
      count: 0,
      inc: () => set((state) => ({ count: state.count + 1 })),
    }));

    function Counter() {
      const { count, inc } = useStoreHook();
      useEffect(inc, []);
      return <div>count: {count}</div>;
    }
    const { findByText } = render(<Counter />);
    await findByText("count: 1");
  });

  test("uses the store hook with selector", async () => {
    const useStoreHook = createStore((set) => ({
      count: 0,
      inc: () => set((state) => ({ ...state, count: state.count + 1 })),
    }));

    function Counter() {
      const count = useStoreHook(({ count }) => count * 2);
      const inc = useStoreHook((state) => {
        const asd = state.inc;
        return asd;
      });
      useEffect(inc, []);
      return <div>count: {count}</div>;
    }
    const { findByText } = render(<Counter />);
    await findByText("count: 2");
  });

  test("only re-renders if selected state has changed", async () => {
    const useStoreHook = createStore((set) => ({
      count: 0,
      inc: () => set((state) => ({ ...state, count: state.count + 1 })),
    }));
    let counterRenderCount = 0;
    let controlRenderCount = 0;

    function Counter() {
      const count = useStoreHook(({ count }) => count);
      counterRenderCount++;
      return <div>count: {count}</div>;
    }
    function Control() {
      const inc = useStoreHook(({ inc }) => inc);
      controlRenderCount++;
      return <button onClick={inc}>button</button>;
    }

    const { getByText, findByText } = render(
      <>
        <Counter />
        <Control />
      </>
    );

    fireEvent.click(getByText("button"));

    await findByText("count: 1");
    expect(counterRenderCount).toBe(2);
    expect(controlRenderCount).toBe(1);
  });

  test("can batch updates", async () => {
    const useStoreHook = createStore((set) => ({
      count: 0,
      inc: () => set((state) => ({ ...state, count: state.count + 1 })),
    }));

    function Counter() {
      const { count, inc } = useStoreHook();
      useEffect(() => {
        unstable_batchedUpdates(() => {
          inc();
          inc();
        });
      }, [inc]);
      return <div>count: {count}</div>;
    }

    const { findByText } = render(<Counter />);

    await findByText("count: 2");
  });

  test("can update the selector", async () => {
    const useStoreHook = createStore(() => ({
      one: "one",
      two: "two",
    }));

    function Component({ selector }) {
      return <div>{useStoreHook(selector)}</div>;
    }

    const { findByText, rerender } = render(
      <Component selector={(store) => store.one} />
    );
    await findByText("one");
    rerender(<Component selector={(store) => store.two} />);
    await findByText("two");
  });

  test("can update the equality checker", async () => {
    const useStoreHook = createStore(() => ({ value: 1 }));
    const { setState } = useStoreHook;
    const selector = ({ value }) => value;

    let renderCount = 0;
    function Component({ equalityFn }) {
      const value = useStoreHook(selector, equalityFn);
      return (
        <div>
          renderCount: {++renderCount}, value: {value}{" "}
        </div>
      );
    }

    const { findByText, rerender } = render(
      <Component equalityFn={() => false} />
    );
    act(() => setState(() => ({ value: 2 })));
    await findByText("renderCount: 2, value: 2");

    rerender(<Component equalityFn={() => true} />);
    act(() => setState(() => ({ value: 3 })));
    await findByText("renderCount: 3, value: 2");
  });

  test("can get the store", () => {
    const { getState } = createStore((_, get) => ({
      value: 1,
      getState1: () => get(),
      getState2: () => getState(),
    }));

    expect(getState().getState1().value).toBe(1);
    expect(getState().getState2().value).toBe(1);
  });

  test("can set the store", () => {
    const { getState, setState } = createStore((set) => ({
      value: 1,
      setState1: (a) => set((state) => ({ ...state, ...a })),
      setState2: (a) => setState((state) => ({ ...state, ...a })),
    }));

    getState().setState1({ value: 2 });
    expect(getState().value).toBe(2);
    getState().setState2({ value: 3 });
    expect(getState().value).toBe(3);
  });

  // test("can subscribe to the store",  () => {
  //   const initialState = { value: 1, other: 'a' }
  //   const { setState, getState, subscribe } = createStore(() => initialState)
  //   const listener = jest.fn()

  // Should not be called if new state identity is the same
  // let unsub = subscribe(() => {
  //   throw new Error('subscriber called when new state identity is the same')
  // })
  // setState(() => initialState)
  // unsub()

  // });

  test("only calls selectors when necessary", async () => {
    const useStoreHook = createStore(() => ({ a: 0, b: 0 }));
    const { setState } = useStoreHook;
    let inlineSelectorCallCount = 0;
    let staticSelectorCallCount = 0;

    const staticSelectorA = (store) => {
      staticSelectorCallCount++;
      return store.a;
    };

    function Component() {
      useStoreHook((s) => {
        inlineSelectorCallCount++;
        return s.b;
      });
      useStoreHook(staticSelectorA)
      return (
        <>
          <div>inline: {inlineSelectorCallCount}</div>
          <div>static: {staticSelectorCallCount}</div>
        </>
      )
    }

    const { rerender, findByText } = render(<Component />)
    await findByText('inline: 1')
    await findByText('static: 1')

    // rerender(<Component />)
    // await findByText('inline: 2')
    // await findByText('static: 1')
    //
    // act(() => setState(() => ({ a: 1, b: 1 })))
    // await findByText('inline: 4')
    // await findByText('static: 2')

  });

  test("", async () => {});

  test("", async () => {});
});
