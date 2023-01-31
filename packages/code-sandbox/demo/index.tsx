// @ts-ignore
import React, { useState, useLayoutEffect } from 'react';
import * as ReactDom from 'react-dom/client';

import Demo, { DefaultCodes, registerPlugins } from '../src';
import { ReactPolyfill } from '../src/plugins/react';
import { EsmToAmdPlugin } from '../src/plugins/babel';
// @ts-ignore
import WebComponentUrl from '../src/webcomponent?url';
// @ts-ignore
import ReactPolyfillUrl from '../src/plugins/react?url';
// @ts-ignore
import JsxPluginUrl from '../src/plugins/babel?url';

const root = ReactDom.createRoot(document.getElementById('root'));

registerPlugins([
    new ReactPolyfill(),
    new EsmToAmdPlugin()
]);
const script = document.createElement('script');
script.type = 'module';
script.innerHTML =
`import { registerPlugins, CodeSandbox } from '${WebComponentUrl}';
import { ReactPolyfill } from '${ReactPolyfillUrl}';
import { EsmToAmdPlugin } from '${JsxPluginUrl}';
registerPlugins([
    new ReactPolyfill(),
    new EsmToAmdPlugin(),
]);
if (!customElements.get('code-sandbox')) {
    customElements.define('code-sandbox', CodeSandbox);
}
`;
document.head.appendChild(script);

const useCode = (defaultCode: string) => {
    const [code, setCode] = useState(defaultCode);
    const [innerCode, setInnerCode] = useState(defaultCode);
    return [code, innerCode, newCode => setInnerCode(newCode), () => setCode(innerCode)] as const;
};

const DemoComp = () => {
    const [code, showCode, onCodeChange, onConfirmDemoCode] = useCode(DefaultCodes.DefaultDemoCode);
    const [index, showIndex, onIndexChange, onConfirmIndexCode] = useCode(DefaultCodes.DefaultIndexCode);
    const [html, showHtml, onHtmlChange, onConfirmHtml] = useCode(DefaultCodes.DefaultHtml);
    const [css, showCss, onCssChange, onConfirmCssCode] = useCode(DefaultCodes.DefaultCssCode);

    const onConfirm = () => {
        onConfirmDemoCode();
        onConfirmIndexCode();
        onConfirmHtml();
        onConfirmCssCode();
    };

    useLayoutEffect(() => {
        const codeSandbox = document.getElementsByTagName('code-sandbox')?.[0];
        if (!codeSandbox) return;
        codeSandbox.addEventListener('loading-module', e => {
            console.log('web component loading module', e);
        });
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '1000px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: '1' }}>
                    <div>App.js</div>
                    <div>
                        <textarea rows={30} value={showCode} onChange={e => onCodeChange(e.target.value)}/>
                    </div>
                </div>
                <div style={{ flex: '1' }}>
                    <div>index.js</div>
                    <div>
                        <textarea rows={30} value={showIndex} onChange={e => onIndexChange(e.target.value)}/>
                    </div>
                </div>
                <div style={{ flex: '1' }}>
                    <div>styles.css</div>
                    <div>
                        <textarea rows={30} value={showCss} onChange={e => onCssChange(e.target.value)}/>
                    </div>
                </div>
                <div style={{ flex: '1' }}>
                    <div>index.html</div>
                    <div>
                        <textarea rows={30} value={showHtml} onChange={e => onHtmlChange(e.target.value)}/>
                    </div>
                </div>
            </div>

            <div style={{ margin: '8px', textAlign: 'right' }}>
                <button onClick={onConfirm}>运行</button>
            </div>

            <div style={{ flex: '1' }}>
                <div>React 组件</div>
                <Demo
                    title="demo"
                    code={code}
                    index={index}
                    html={html}
                    css={css}
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                    onLoadingModule={(moduleName, url) => {
                        console.log('loading module react', moduleName, url);
                    }}
                />
            </div>

            <div style={{ flex: '1' }}>
                <div>Web Component 组件</div>
                {/* @ts-ignore */}
                <code-sandbox
                    title="demo"
                    code={code}
                    index={index}
                    html={html}
                    css={css}
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                />
            </div>
        </div>
    );
};

root.render(
    <DemoComp/>
);
