import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const codeString =
  'const useToggleMachineStore = createStore(\n' +
  '  devtools(\n' +
  '    persist(\n' +
  '      xstate(\n' +
  '        (set, get, api) =>\n' +
  '          Machine(\n' +
  '            {\n' +
  '              id: "toggle",\n' +
  '              initial: "active",\n' +
  '              states: {\n' +
  '                active: {\n' +
  '                  on: {\n' +
  '                    TOGGLE: { target: "inactive", actions: "incrementCount" },\n' +
  '                  },\n' +
  '                },\n' +
  '                inactive: {\n' +
  '                  on: {\n' +
  '                    TOGGLE: { target: "active", actions: "incrementCount" },\n' +
  '                  },\n' +
  '                },\n' +
  '              },\n' +
  '            },\n' +
  '            {\n' +
  '              actions: {\n' +
  '                incrementCount() {\n' +
  '                  set(\n' +
  '                    (context) => ({ ...context, times: context.times + 1 }),\n' +
  '                    "incrementCount"\n' +
  '                  );\n' +
  '                },\n' +
  '              },\n' +
  '            }\n' +
  '          ),\n' +
  '        { times: 0 }\n' +
  '      ),\n' +
  '      { name: "xstate-counter" }\n' +
  '    ),\n' +
  '    "toggle"\n' +
  '  )\n' +
  ');\n' +
  '\n' +
  'const Light = () => {\n' +
  '  const { state, context } = useToggleMachineStore();\n' +
  '  return (\n' +
  '    <Fragment>\n' +
  '      <h1>\n' +
  '        the light is:\n' +
  '        <br />\n' +
  '        {state === "active" ? "open" : "close"}\n' +
  '      </h1>\n' +
  '      <div>toggle count: {context.times}</div>\n' +
  '    </Fragment>\n' +
  '  );\n' +
  '};\n' +
  '\n' +
  'const Toggle = () => {\n' +
  '  const sendEvent = useToggleMachineStore((state) => state.sendEvent);\n' +
  '  return <button onClick={() => sendEvent.toggle()}>toggle</button>;\n' +
  '};\n' +
  '\n' +
  'export const XstateStore = () => (\n' +
  '  <Fragment>\n' +
  '    <Light />\n' +
  '    <Toggle />\n' +
  '    <Code />\n' +
  '  </Fragment>\n' +
  ');\n'

export const Code = () => (
  <SyntaxHighlighter language="javascript" style={docco}>
    {codeString}
  </SyntaxHighlighter>
)