export const DefaultDemoCode =
    `import React from 'react';
// Load umd modules support \`unpkg\` like ant-design automatically, you just need to import it.
// Others umd modules without \`unpkg\` field in package.json, you can specific path manually.
import { Form, Button, Modal, Input } from 'antd';
import HelloModule from 'hello-module';

const { Item, useForm, useWatch } = Form;

const App = (props) => {
    const [form] = useForm();
    const username = useWatch('username', form);
    
    const onFinish = () => {
        const password = form.getFieldValue('password');
        if (password !== '123456') {
            Modal.error({
                title: '登录失败',
                content: '登录失败，密码错误！'
            });
            return;
        }
        Modal.success({
            title: '登录成功',
            content: '登录成功'
        });
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <HelloModule/>
            <div className="title">title class</div>
            <Form
                form={form}
                onFinish={onFinish}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
            >
                <Item label="用户名" name="username">
                    <Input placeholder="请输入用户名"/>
                </Item>
                <Item label="密码" name="password">
                    <Input type="password" placeholder={\`请输入 \${username} 的密码\`} />
                </Item>
                <Item>
                    <Button type="primary" htmlType="submit">提交</Button>
                </Item>
            </Form>
        </div>
    );
}
export default App;`;

export const DefaultIndexCode =
    `import React from 'react';
import ReactDom from 'react-dom';
import App from './App';

ReactDom.render(<App/>, document.getElementById('root'));`;

export const DepsCommonHeader =
    `//============================================================
// Do not modify following import and export statements
import * as React from 'react';
import { define, _import } from 'module-manager';
export default 'module-valid';
//=============================================================
// 🚀🚀 Declare where to insert module script tags.
export const body = document.body;

// 🚀🚀 This is a function declared how to resolve module script when require a module doesn't exist.
// export async function resolve(packageName, version, file) {
//     const versionSuffix = version ? \`@\${version}\` : '';
//     const fileSuffix = file ? \`\${file}\` : '';
//     // \`return false\` to cancel auto require deps.
//     return \`https://unpkg.com/\${packageName}\${versionSuffix}\${fileSuffix}\`;
// }

// 🚀🚀 You can define your dependencies here:
define('version', [], () => ({ 'default': '1.0.0' }));
`;

export const DefaultDepsCode =
    `${DepsCommonHeader}
// 🚀 e.g.1 Custom Module: call define functions, pass the module name and an async module function to it just like:
define('hello-module', ['require', 'jquery'], async (require, jq) => {
    // 🚀You can call \`_require\` function ** asynchronously ** to get others modules.
    // Please pay attention to the ** cycle dependencies **.
    const jq2 = await require('jquery');
    
    // Some others statements to generate the module.
    
    // Return things you want to export as an object, you can specify \`default\` property for the ES Module default import.
    return {
        // 🚀Jsx can be used ! 
        'default': () => {
            const onclick = () => jq('#_hello_demo')[0].style.setProperty('color', 'red');
            return <div id="_hello_demo" style={{ marginBottom: '16px' }} onClick={onclick}>Login Page</div>;
        }
    };
});

// 🚀 e.g.2 Public scripts that mount export result on window or global.
// 📢 this function is not effective for umd script, please import umd script directly, it will be load automatically.
// define('module-name', [], _import('https://xxxx.xxxx', 'objectName'));`

export const DefaultCssCode =
    `.title { color: blue }`;

export const Placeholder = '<h3> 🚀 Welcome to use code sandbox. </h3>';

export const formatDeps = (deps: Array<{ url: string; obj: string; id: string; }>) => [DepsCommonHeader, deps?.map(dep => {
    return `define('${dep.id}', ['require'], _import('${dep.url}', '${dep.obj}'));`;
})].join('\n');
