import {IPlaygroundCode} from "@/types/utils";

export const DefaultDemoCode =
`import React from 'react';
import Hello from 'hello-module';
import jq from 'jquery';
import moment from 'moment';

const TestFC = (props) => {
    const [state, setState] = React.useState(0);
    const [date, setDate] = React.useState(0);

    React.useEffect(() => {
        setDate(moment().format('YYYY-MM-DD HH:mm:ss'));
        if (state === 5) throw new Error('Error Boundary test');
    }, [state]);
    
    const onChangeColor = () => {
        jq('#target')[0].style = "background-color: red";
    };

    return (
        <div>
            <Hello/>
            <div id="target" onClick={onChangeColor}>
                click to change bg color {date}
            </div>
            <button onClick={() => setState(state => state+1)}>Click Me To Change State!({state})</button>
        </div>
    );
}
export default TestFC;`;

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

export const DefaultDepsCode = `${DepsCommonHeader}
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
            const onclick = () => jq('#_hello_demo')[0].style = 'color: red;';
            return <div id="_hello_demo" onClick={onclick}>module hello world</div>;
        }
    };
});

// 🚀 e.g.2 Public scripts that mount export result on window or global.
// 📢 this function is not effective for umd script, please import umd script directly, it will be load automatically.
// define('module-name', [], _import('https://xxxx.xxxx', 'objectName'));`

export const formatDeps = (deps: IPlaygroundCode['deps']) => [DepsCommonHeader, deps?.map(dep => {
    return `define('${dep.id}', ['require'], _import('${dep.url}', '${dep.obj}'));`;
})].join('\n');
