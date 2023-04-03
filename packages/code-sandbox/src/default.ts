export const DefaultDemoFileName = '/Demo.js';
export const DefaultDemoCode =
`// ⚠️这里这个 require 函数和标准 amd 的 require 不同，返回 promise 可以直接 await
// const React = await require('react');
// import React from 'react';

// 初始化 sandbox 时注册添加 \`EsmToAmdPlugin\`, 可以使用 import 关键字
import React, { useState } from 'react';
// 可以直接从 unpkg.com 自动导入满足 umd / amd 规范的依赖
import { Button, Modal } from 'antd';

const App: React.FC<{}> = props => {
    const [show, setShow] = useState(false);
    
    return (
        <>
            <Modal
                open={show}
                title="这是一个 ant-design 的弹窗"
                onCancel={() => setShow(false)}
                onOk={() => setShow(false)}
            >
                <span>这是弹窗的内容 🚀</span>
            </Modal>
            <Button type="primary" onClick={() => setShow(true)}>点击Antd按钮</Button>
        </>
    )
}

// module.exports.default = App
// 初始化 sandbox 时注册添加 \`EsmToAmdPlugin\`, 可以使用 export 关键字导出组件
export default App;`;

export const DefaultIndexCode =
`// const React = await require('react');
// const ReactDom = await require('react-dom');
// const App = (await require('./Demo.js')).default;

// 初始化 sandbox 时注册添加 \`EsmToAmdPlugin\`, 可以使用 import 关键字
import React from 'react';
import ReactDom from 'react-dom';
import App from './App';

ReactDom.render(React.createElement(App, {}), document.getElementById('root'));`;

export const DefaultHtml =
`<noscript>Need javascript to run this demo page.</noscript>
<div id="root">
    <h3> 🚀 Welcome to use code sandbox. </h3>
</div>`;

export const DefaultCssCode =
`.title { color: blue }`;
