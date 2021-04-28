import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const codeString =
  'const useCountStore = createStore(\n' +
  '  devtools(\n' +
  '    persist(\n' +
  '    (set, get) => ({\n' +
  '      count: 0,\n' +
  '      increment: () =>\n' +
  '        set((store) => ({ ...store, count: store.count + 1 }), \'increment\'),\n' +
  '      decrement: () =>\n' +
  '        set((store) => ({ ...store, count: store.count - 1 }), \'decrement\'),\n' +
  '    }),\n' +
  '      {name:\'normal-store\'}\n' +
  '  ), \'counter\')\n' +
  ');\n' +
  '\n' +
  'const Increment = memo(() => {\n' +
  '  const { increment } = useCountStore();\n' +
  '  return <button onClick={increment}>increment</button>;\n' +
  '});\n' +
  '\n' +
  'const Decrement = memo(() => {\n' +
  '  const { decrement } = useCountStore();\n' +
  '  return <button onClick={decrement}>decrement</button>;\n' +
  '});\n' +
  '\n' +
  'const Count = memo(() => {\n' +
  '  const count = useCountStore((state) => state.count * 2);\n' +
  '  return <h1>{count}</h1>;\n' +
  '});\n' +
  '\n' +
  'export const NormalStore = () => (\n' +
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