import {IPlaygroundCode} from "@/types/utils";

export const DefaultDemoCode =
`import React from 'react';
import Hello from 'hello-module';
import jq from 'jquery';

const TestFC = (props) => {
    const [state, setState] = React.useState(0);

    React.useEffect(() => {
        if (state === 5) throw new Error('Error Boundary test');
    }, [state]);
    
    const onChangeColor = () => {
        jq('#target')[0].style = "background-color: red";
    };

    return (
        <div>
            <Hello/>
            <div id="target" onClick={onChangeColor}>
                click to change bg color
            </div>
            <button onClick={() => setState(state => state+1)}>Click Me To Change State!({state})</button>
        </div>
    );
}

export default TestFC;`;

export const DepsCommonHeader =
`//============================================================
// Do not modify following import and export statements
import React from 'react';
import { define, importScript } from 'module-manager';
export default 'module-valid';
//============================================================
// 🚀🚀 This is a tool function for import umd script module
const _import = (url, obj) => importScript(url, obj, document.body);

// 🚀🚀 You can define your dependencies here:
define('version', () => ({ 'default': '1.0.0' }));
`;

export const DefaultDepsCode = `${DepsCommonHeader}
// 🚀 eg.1 Custom Module: call define functions, pass the module name and an async module function to it just like:
define('hello-module', async _require => {
    // 🚀You can call \`_require\` function ** asynchronously ** to get others modules.
    // Please pay attention to the ** cycle dependencies **.
    const { default: jq } = await _require('jquery');
    
    // Some others statements to generate the module.
    
    // Return things you want to export as an object, you can specify \`default\` property for the ES Module default import.
    return {
        // 🚀Jsx can be used ! 
        'default': () => {
            const onclick = () => jq('#_hello_demo')[0].style = 'color: red;';
            return <div id="_hello_demo" onClick={onclick}>module hello world</div>;
        }
    }
});

// 🚀 eg.2 Public umd scripts
define('jquery', _import('https://unpkg.com/jquery@3.6.3/dist/jquery.js', '$'));`

export const formatDeps = (deps: IPlaygroundCode['deps']) => [DepsCommonHeader, deps?.map(dep => {
    return `define('${dep.id}', _import('${dep.url}', '${dep.obj}'));`;
})].join('\n');
