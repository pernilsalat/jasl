import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const codeString =
  'const reducer = (state, action) => {\n' +
  '  switch (action.type) {\n' +
  '    case \'increment\':\n' +
  '      return { ...state, count: state.count + 1 };\n' +
  '    case \'decrement\':\n' +
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
  '        increment: () => api.dispatch({ type: \'increment\' }),\n' +
  '        decrementAction: { type: \'decrement\' },\n' +
  '      })),\n' +
  '      { name: \'count-redux\' }\n' +
  '    ),\n' +
  '    \'counterRedux\'\n' +
  '  )\n' +
  ');\n' +
  '\n' +
  'const Increment = memo(() => {\n' +
  '  const { increment } = useCountStoreRedux();\n' +
  '  return <button onClick={increment}>increment</button>;\n' +
  '});\n' +
  '\n' +
  'const Decrement = memo(() => {\n' +
  '  const { decrementAction, dispatch } = useCountStoreRedux();\n' +
  '  return <button onClick={() => dispatch(decrementAction)}>decrement</button>;\n' +
  '});\n' +
  '\n' +
  'const Count = memo(() => {\n' +
  '  const count = useCountStoreRedux((state) => {\n' +
  '    return state.count * 2;\n' +
  '  });\n' +
  '  return <h1>{count}</h1>;\n' +
  '});\n' +
  '\n' +
  'export const ReduxStore = () => (\n' +
  '  <Fragment>\n' +
  '    <Count/>\n' +
  '    <Increment/>\n' +
  '    <Decrement/>\n' +
  '  </Fragment>\n' +
  ')'

export const Code = () => (
  <SyntaxHighlighter language="javascript" style={docco}>
    {codeString}
  </SyntaxHighlighter>
)