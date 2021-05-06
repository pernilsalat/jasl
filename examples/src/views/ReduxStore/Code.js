import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const codeString =
  'const reducer = (state, action) => {\n' +
  '  switch (action.type) {\n' +
  '    case "increment":\n' +
  '      return { ...state, count: state.count + 1 };\n' +
  '    case "decrement":\n' +
  '      return { ...state, count: state.count - 1 };\n' +
  '    default:\n' +
  '      return state;\n' +
  '  }\n' +
  '};\n' +
  '\n' +
  'const useCountStoreRedux = createStore(\n' +
  '  devtools(\n' +
  '    persist(\n' +
  '      redux(reducer, (set, get, api) => ({\n' +
  '        count: 0,\n' +
  '        increment: () => api.dispatch({ type: "increment" }),\n' +
  '        decrementAction: { type: "decrement" },\n' +
  '      })),\n' +
  '      { name: "count-redux", whitelist: ["count"] }\n' +
  '    ),\n' +
  '    "counterRedux"\n' +
  '  )\n' +
  ');\n' +
  '\n' +
  'const Increment = () => {\n' +
  '  const increment = useCountStoreRedux((state) => state.increment);\n' +
  '  return <button onClick={increment}>increment</button>;\n' +
  '};\n' +
  '\n' +
  'const customEqual = (obj1, obj2) => {\n' +
  '  return (\n' +
  '    obj1.decrementAction.type === obj2.decrementAction.type &&\n' +
  '    Object.is(obj1.dispatch, obj2.dispatch)\n' +
  '  );\n' +
  '};\n' +
  '\n' +
  'const Decrement = () => {\n' +
  '  const { decrementAction, dispatch } = useCountStoreRedux(\n' +
  '    ({ decrementAction, dispatch }) => ({\n' +
  '      decrementAction,\n' +
  '      dispatch,\n' +
  '    }),\n' +
  '    customEqual\n' +
  '  );\n' +
  '  return <button onClick={() => dispatch(decrementAction)}>decrement</button>;\n' +
  '};\n' +
  '\n' +
  'const Count = () => {\n' +
  '  const count = useCountStoreRedux((state) => state.count * 2);\n' +
  '  return <h1>{count}</h1>;\n' +
  '};\n' +
  '\n' +
  'export const ReduxStore = () => (\n' +
  '  <Fragment>\n' +
  '    <Count />\n' +
  '    <Increment />\n' +
  '    <Decrement />\n' +
  '    <Code />\n' +
  '  </Fragment>\n' +
  ')'

export const Code = () => (
  <SyntaxHighlighter language="javascript" style={docco}>
    {codeString}
  </SyntaxHighlighter>
)