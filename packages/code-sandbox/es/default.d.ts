export declare const DefaultDemoFileName = "/Demo.js";
export declare const DefaultDemoCode = "// \u26A0\uFE0F\u8FD9\u91CC\u8FD9\u4E2A require \u51FD\u6570\u548C\u6807\u51C6 amd \u7684 require \u4E0D\u540C\uFF0C\u8FD4\u56DE promise \u53EF\u4EE5\u76F4\u63A5 await\n// const React = await require('react');\n// import React from 'react';\n\n// \u521D\u59CB\u5316 sandbox \u65F6\u6CE8\u518C\u6DFB\u52A0 `EsmToAmdPlugin`, \u53EF\u4EE5\u4F7F\u7528 import \u5173\u952E\u5B57\nimport React, { useState } from 'react';\n// \u53EF\u4EE5\u76F4\u63A5\u4ECE unpkg.com \u81EA\u52A8\u5BFC\u5165\u6EE1\u8DB3 umd / amd \u89C4\u8303\u7684\u4F9D\u8D56\nimport { Button, Modal } from 'antd';\n\nconst App: React.FC<{}> = props => {\n    const [show, setShow] = useState(false);\n    \n    return (\n        <>\n            <Modal\n                open={show}\n                title=\"\u8FD9\u662F\u4E00\u4E2A ant-design \u7684\u5F39\u7A97\"\n                onCancel={() => setShow(false)}\n                onOk={() => setShow(false)}\n            >\n                <span>\u8FD9\u662F\u5F39\u7A97\u7684\u5185\u5BB9 \uD83D\uDE80</span>\n            </Modal>\n            <Button type=\"primary\" onClick={() => setShow(true)}>\u70B9\u51FBAntd\u6309\u94AE</Button>\n        </>\n    )\n}\n\n// module.exports.default = App\n// \u521D\u59CB\u5316 sandbox \u65F6\u6CE8\u518C\u6DFB\u52A0 `EsmToAmdPlugin`, \u53EF\u4EE5\u4F7F\u7528 export \u5173\u952E\u5B57\u5BFC\u51FA\u7EC4\u4EF6\nexport default App;";
export declare const DefaultIndexCode = "// const React = await require('react');\n// const ReactDom = await require('react-dom');\n// const App = (await require('./Demo.js')).default;\n\n// \u521D\u59CB\u5316 sandbox \u65F6\u6CE8\u518C\u6DFB\u52A0 `EsmToAmdPlugin`, \u53EF\u4EE5\u4F7F\u7528 import \u5173\u952E\u5B57\nimport React from 'react';\nimport ReactDom from 'react-dom';\nimport App from './Demo.js';\n\nReactDom.render(React.createElement(App, {}), document.getElementById('root'));";
export declare const DefaultHtml = "<noscript>Need javascript to run this demo page.</noscript>\n<div id=\"root\">\n    <h3> \uD83D\uDE80 Welcome to use code sandbox. </h3>\n</div>";
export declare const DefaultCssCode = ".title { color: blue }";